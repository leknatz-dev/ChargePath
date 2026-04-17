import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import type { Spot } from '../../types/map';

const MARKER_COLOR = '#34C759';
const LARGE_ICON_SIZE = 32;
const SMALL_ICON_SIZE = 24;
const ZOOM_THRESHOLD = 0.015;

type SpotMarkerProps = {
  spot: Spot;
  zoom: number;
  onPress: () => void;
  selected?: boolean;
};

export function SpotMarker({ spot, zoom, onPress, selected = false }: SpotMarkerProps) {
  const iconSize = zoom > ZOOM_THRESHOLD ? LARGE_ICON_SIZE : SMALL_ICON_SIZE;
  const glowSize = iconSize + 24;

  return (
    <Marker
      coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>
        {selected && (
          <View
            style={[
              styles.selectionGlow,
              {
                width: glowSize,
                height: glowSize,
                borderRadius: glowSize / 2,
              },
            ]}
          />
        )}
        {selected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="flash" size={14} color="#34C759" />
          </View>
        )}
        <Ionicons name="flash" size={iconSize} color={MARKER_COLOR} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 199, 89, 0.18)',
  },
  selectedBadge: {
    position: 'absolute',
    top: -24,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
