import React from 'react';
import { Marker } from 'react-native-maps';
import type { Spot } from '../../types/map';

const ZOOM_FULL = 0.02;
const ZOOM_DOT = 0.038;

type ZoomLevel = 'full' | 'small' | 'dot';

function getZoomLevel(zoom: number): ZoomLevel {
  if (zoom < ZOOM_FULL) return 'full';
  if (zoom < ZOOM_DOT) return 'small';
  return 'dot';
}

type SpotMarkerProps = {
  spot: Spot;
  zoom: number;
  selected?: boolean;
  onPress: (spot: Spot) => void;
};

export function SpotMarker({
  spot,
  zoom,
  selected = false,
  onPress,
}: SpotMarkerProps) {
  const zoomLevel = getZoomLevel(zoom);

  if (zoomLevel === 'dot') {
    return (
      <Marker
        coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
        anchor={{ x: 0.5, y: 0.5 }}
        tracksViewChanges={false}
        onPress={() => onPress(spot)}
        image={require('../../../assets/images/pin-dot.png')}
      />
    );
  }

  const iconSize = zoomLevel === 'full' ? 28 : 20;

  if (spot.type === 'hybrid') {
    return (
      <Marker
        coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
        anchor={{ x: 0.5, y: 1 }}
        tracksViewChanges={false}
        onPress={() => onPress(spot)}
        image={require('../../../assets/images/pin-hybrid.png')}
        style={{ width: iconSize, height: iconSize, opacity: selected ? 0.6 : 1 }}
      />
    );
  }

  return (
    <Marker
      coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
      onPress={() => onPress(spot)}
      image={require('../../../assets/images/pin-charging.png')}
      style={{ width: iconSize, height: iconSize, opacity: selected ? 0.6 : 1 }}
    />
  );
}

// ---------------------------------------------------------------------------
// Ghost Marker
// ---------------------------------------------------------------------------
type GhostMarkerProps = {
  coordinate: { latitude: number; longitude: number };
  selectionMode: 'tap' | 'crosshair';
};

export function GhostMarker({ coordinate, selectionMode }: GhostMarkerProps) {
  return (
    <Marker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={true}
      image={
        selectionMode === 'crosshair'
          ? require('../../../assets/images/pin-charging.png')
          : require('../../../assets/images/pin-hybrid.png')
      }
      style={{ opacity: 0.5 }}
    />
  );
}