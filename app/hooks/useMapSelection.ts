import { Alert, useEffect, useRef, useState } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import type { Spot, FlowState, SelectionMode } from '../types/map';

const DEFAULT_REGION = {
  latitude: 14.5995,
  longitude: 120.9842,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const DEFAULT_SPOTS: Spot[] = [
  { id: '1', name: 'Verified Spot', status: 'verified', latitude: 8.5147, longitude: 124.5670 },
  { id: '2', name: 'Unverified Spot', status: 'unverified', latitude: 8.5120, longitude: 124.5700 },
  { id: '3', name: 'Potential Spot', status: 'establishment', latitude: 8.5160, longitude: 124.5690 },
];

export function useMapSelection() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('tap');
  const [spots, setSpots] = useState<Spot[]>(DEFAULT_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number }>({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });
  const [zoom, setZoom] = useState(DEFAULT_REGION.latitudeDelta);
  const [reviewComment, setReviewComment] = useState('');
  const mapRef = useRef<React.ComponentRef<typeof MapView>>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need your location to show nearby charging spots!');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      mapRef.current?.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const selectSpot = (spot: Spot) => {
    setSelectedSpot(spot);
    setTempLocation({ latitude: spot.latitude, longitude: spot.longitude });
  };

  const selectLocation = (coordinate: { latitude: number; longitude: number }) => {
    setSelectedSpot(null);
    setTempLocation(coordinate);
  };

  const handlePoiClick = (event: any) => {
    const poi = event.nativeEvent;
    if (flowState === 'selecting' && selectionMode === 'tap') {
      const coordinate = { latitude: poi.coordinate.latitude, longitude: poi.coordinate.longitude };
      const matchedSpot = spots.find(
        (spot) =>
          spot.id === poi.placeId ||
          (Math.abs(spot.latitude - coordinate.latitude) < 0.0001 && Math.abs(spot.longitude - coordinate.longitude) < 0.0001),
      );
      if (matchedSpot) {
        selectSpot(matchedSpot);
      } else {
        selectLocation(coordinate);
      }
      return;
    }

    setSpots((current) => {
      const newId = poi.placeId || Math.random().toString();
      if (current.some((spot) => spot.id === newId)) {
        return current;
      }
      return [
        ...current,
        {
          id: newId,
          name: poi.name,
          latitude: poi.coordinate.latitude,
          longitude: poi.coordinate.longitude,
          status: 'verified',
        },
      ];
    });
  };

  const handleMapPress = (event: any) => {
    if (flowState === 'selecting' && selectionMode === 'tap') {
      selectLocation(event.nativeEvent.coordinate);
    }
  };

  const handleRegionChangeComplete = (region: any) => {
    setZoom(region.latitudeDelta);
    setMapCenter({ latitude: region.latitude, longitude: region.longitude });

    if (flowState === 'selecting' && selectionMode === 'crosshair') {
      setTempLocation({ latitude: region.latitude, longitude: region.longitude });
    }
  };

  const enterSelectionMode = () => {
    setFlowState('selecting');
    setSelectionMode('crosshair');
    setTempLocation(mapCenter);
    setSelectedSpot(null);
    setSelectedLocation(null);
  };

  const cancelSelection = () => {
    setFlowState('idle');
    setTempLocation(null);
    setSelectedLocation(null);
    setSelectionMode('tap');
  };

  const handleConfirmLocation = () => {
    if (selectionMode === 'tap' && !tempLocation) {
      Alert.alert('Select a location first', 'Tap a POI or press on the map to choose a location.');
      return;
    }

    if (selectionMode === 'tap' && selectedSpot) {
      setSpots((current) =>
        current.map((spot) =>
          spot.id === selectedSpot.id ? { ...spot, reviewed: true, status: 'verified' } : spot,
        ),
      );
    }

    if (tempLocation) {
      setSelectedLocation(tempLocation);
      setFlowState('form');
    }
  };

  const handleSubmitReview = () => {
    if (!selectedLocation) {
      Alert.alert('No location selected', 'Please select a location before submitting.');
      return;
    }

    setSpots((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name: 'New Review',
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        status: 'verified',
      },
    ]);

    setSelectedLocation(null);
    setTempLocation(null);
    setReviewComment('');
    setFlowState('idle');
    setSelectionMode('tap');
  };

  const isSelecting = flowState === 'selecting';
  const isFormVisible = flowState === 'form';
  const isTapConfirmDisabled = selectionMode === 'tap' && !tempLocation;

  return {
    location,
    flowState,
    selectionMode,
    spots,
    selectedSpot,
    tempLocation,
    selectedLocation,
    mapCenter,
    zoom,
    reviewComment,
    mapRef,
    isSelecting,
    isFormVisible,
    isTapConfirmDisabled,
    handlePoiClick,
    handleMapPress,
    handleRegionChangeComplete,
    handleConfirmLocation,
    handleSubmitReview,
    enterSelectionMode,
    cancelSelection,
    selectSpot,
    selectLocation,
    setSelectionMode,
    setReviewComment,
  };
}
