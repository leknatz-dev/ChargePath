import { useRef, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import MapView, { MapPressEvent, PoiClickEvent, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import type { Spot, FlowState, SelectionMode } from '../types/map';
import { DEFAULT_SPOTS } from '../types/map';
import type { ReviewFormData } from '../components/map/ReviewFormOverlay';

const OPOL_REGION = {
  latitude: 8.5147,
  longitude: 124.5670,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export function useMapSelection() {
  const mapRef = useRef<React.ComponentRef<typeof MapView>>(null);

  // Map state
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number }>({
    latitude: OPOL_REGION.latitude,
    longitude: OPOL_REGION.longitude,
  });
  const [zoom, setZoom] = useState(OPOL_REGION.latitudeDelta);

  // Spot data
  const [spots, setSpots] = useState<Spot[]>(DEFAULT_SPOTS);

  // Selection flow
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('tap');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Detail sheet
  const [detailSpot, setDetailSpot] = useState<Spot | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // Review form
  const [reviewComment, setReviewComment] = useState('');
  const [price, setPrice] = useState('');

  // ---------------------------------------------------------------------------
  // GPS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Denied',
          'Enable location to see your position on the map.',
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setMapCenter(coords);

      mapRef.current?.animateToRegion({
        ...coords,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  // ---------------------------------------------------------------------------
  // Map event handlers
  // ---------------------------------------------------------------------------
  const handlePoiClick = (event: PoiClickEvent) => {
    const poi = event.nativeEvent;
    const coordinate = {
      latitude: poi.coordinate.latitude,
      longitude: poi.coordinate.longitude,
    };

    if (flowState === 'idle') {
      const linkedSpot = spots.find(
        (s) =>
          s.businessName?.toLowerCase() === poi.name?.toLowerCase() ||
          (Math.abs(s.latitude - coordinate.latitude) < 0.0002 &&
            Math.abs(s.longitude - coordinate.longitude) < 0.0002),
      );

      if (linkedSpot) {
        openDetailSheet(linkedSpot);
      }
      return;
    }

    if (flowState === 'selecting' && selectionMode === 'tap') {
      const existingSpot = spots.find(
        (s) =>
          Math.abs(s.latitude - coordinate.latitude) < 0.0002 &&
          Math.abs(s.longitude - coordinate.longitude) < 0.0002,
      );

      if (existingSpot) {
        setSelectedSpot(existingSpot);
        setTempLocation(coordinate);
      } else {
        setSelectedSpot(null);
        setTempLocation(coordinate);
      }
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    if (flowState === 'idle') {
      closeDetailSheet();
      return;
    }

    if (flowState === 'selecting' && selectionMode === 'tap') {
      setSelectedSpot(null);
      setTempLocation(event.nativeEvent.coordinate);
    }
  };

  const handleRegionChangeComplete = (region: Region) => {
    setZoom(region.latitudeDelta);
    setMapCenter({ latitude: region.latitude, longitude: region.longitude });

    if (flowState === 'selecting' && selectionMode === 'crosshair') {
      setTempLocation({ latitude: region.latitude, longitude: region.longitude });
    }
  };

  const handleSpotMarkerPress = (spot: Spot) => {
    if (flowState === 'idle') {
      openDetailSheet(spot);
      return;
    }

    if (flowState === 'selecting' && selectionMode === 'tap') {
      setSelectedSpot(spot);
      setTempLocation({ latitude: spot.latitude, longitude: spot.longitude });
    }
  };

  // ---------------------------------------------------------------------------
  // Detail sheet
  // ---------------------------------------------------------------------------
  const openDetailSheet = (spot: Spot) => {
    setDetailSpot(spot);
    setIsDetailVisible(true);
  };

  const closeDetailSheet = () => {
    setIsDetailVisible(false);
    setTimeout(() => setDetailSpot(null), 300);
  };

  // ---------------------------------------------------------------------------
  // Selection flow
  // ---------------------------------------------------------------------------
  const enterSelectionMode = () => {
    closeDetailSheet();
    setFlowState('selecting');
    setSelectionMode('crosshair');
    setTempLocation(mapCenter);
    setSelectedSpot(null);
    setSelectedLocation(null);
  };

  // ---------------------------------------------------------------------------
  // NEW — enterReviewMode
  // Called from "Add Review" button in SpotDetailSheet
  // Skips the entire selection step and jumps straight to the form
  // with the spot already pre-selected
  // ---------------------------------------------------------------------------
  const enterReviewMode = (spot: Spot) => {
    closeDetailSheet();
    // Small delay so sheet closes before form opens
    setTimeout(() => {
      setSelectedSpot(spot);
      setSelectedLocation({ latitude: spot.latitude, longitude: spot.longitude });
      setTempLocation({ latitude: spot.latitude, longitude: spot.longitude });
      setSelectionMode('tap');
      setFlowState('form');
    }, 300);
  };

  const cancelSelection = () => {
    setFlowState('idle');
    setTempLocation(null);
    setSelectedLocation(null);
    setSelectedSpot(null);
    setSelectionMode('tap');
    setReviewComment('');
    setPrice('');
  };

  const handleConfirmLocation = () => {
    if (selectionMode === 'tap' && !tempLocation) {
      Alert.alert(
        'No location selected',
        'Tap an existing pin or a spot on the map first.',
      );
      return;
    }

    if (tempLocation) {
      setSelectedLocation(tempLocation);
      setFlowState('form');
    }
  };

  // ---------------------------------------------------------------------------
  // Review submission
  // ---------------------------------------------------------------------------
  const handleSubmitReview = (formData: ReviewFormData) => {
  if (!selectedLocation) {
    Alert.alert('No location selected', 'Please confirm a location before submitting.');
    return;
  }

  const newReview = {
    id: `review-${Date.now()}`,
    author: 'You',
    priceRange: formData.priceRange,
    feeType: formData.feeType,
    outletTypes: formData.outletTypes,
    accessType: formData.accessType,
    parkingTypes: formData.parkingTypes,
    amenities: formData.amenities,
    vibe: formData.vibe,
    notes: formData.notes,
    rating: 5,
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (selectedSpot) {
    setSpots((current) =>
      current.map((s) =>
        s.id === selectedSpot.id
          ? {
              ...s,
              reviews: [...(s.reviews ?? []), newReview],
              verificationCount: (s.verificationCount ?? 0) + 1,
              status: (s.verificationCount ?? 0) + 1 >= 3 ? 'verified' : s.status,
            }
          : s,
      ),
    );
  } else {
    const newSpot: Spot = {
      id: `spot-${Date.now()}`,
      name: formData.notes.trim() || 'New Charging Spot',
      type: selectionMode === 'crosshair' ? 'independent' : 'hybrid',
      status: 'unverified',
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      reviews: [newReview],
      verificationCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSpots((current) => [...current, newSpot]);
  }

  setFlowState('idle');
  setSelectionMode('tap');
  setTempLocation(null);
  setSelectedLocation(null);
  setSelectedSpot(null);
  setReviewComment('');
  setPrice('');
};

  // ---------------------------------------------------------------------------
  // Derived flags
  // ---------------------------------------------------------------------------
  const isSelecting = flowState === 'selecting';
  const isFormVisible = flowState === 'form';
  const isTapConfirmDisabled = selectionMode === 'tap' && !tempLocation;
  const showCrosshair = isSelecting && selectionMode === 'crosshair';

  return {
    mapRef,
    location,
    mapCenter,
    zoom,
    OPOL_REGION,
    spots,
    flowState,
    selectionMode,
    selectedSpot,
    tempLocation,
    selectedLocation,
    detailSpot,
    isDetailVisible,
    reviewComment,
    price,
    isSelecting,
    isFormVisible,
    isTapConfirmDisabled,
    showCrosshair,
    handlePoiClick,
    handleMapPress,
    handleRegionChangeComplete,
    handleSpotMarkerPress,
    handleConfirmLocation,
    handleSubmitReview,
    enterSelectionMode,
    enterReviewMode,       // ← new
    cancelSelection,
    openDetailSheet,
    closeDetailSheet,
    setSelectionMode,
    setReviewComment,
    setPrice,
  };
}