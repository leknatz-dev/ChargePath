import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { SelectionMode } from '../../types/map';

type SelectionModeControlsProps = {
  selectionMode: SelectionMode;
  onChangeMode: (mode: SelectionMode) => void;
  showCrosshair: boolean;
};

export function SelectionModeControls({
  showCrosshair,
}: SelectionModeControlsProps) {
  return (
    <>
      {showCrosshair && (
        <View style={styles.crosshairOverlay} pointerEvents="none">
          <View style={styles.crosshairLineH} />
          <View style={styles.crosshairLineV} />
          <View style={styles.crosshairDot} />
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  crosshairOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  crosshairLineH: {
    position: 'absolute',
    width: 44,
    height: 1.5,
    backgroundColor: 'rgba(52, 199, 89, 0.8)',
  },
  crosshairLineV: {
    position: 'absolute',
    width: 1.5,
    height: 44,
    backgroundColor: 'rgba(52, 199, 89, 0.8)',
  },
  crosshairDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#34C759',
  },
  cornerTL: {
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -32,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 3,
  },
  cornerTR: {
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: 18,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 3,
  },
  cornerBL: {
    top: '50%',
    left: '50%',
    marginTop: 18,
    marginLeft: -32,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 3,
  },
  cornerBR: {
    top: '50%',
    left: '50%',
    marginTop: 18,
    marginLeft: 18,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 3,
  },
});