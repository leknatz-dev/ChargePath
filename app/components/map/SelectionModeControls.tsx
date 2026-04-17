import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SelectionMode } from '../../types/map';

type SelectionModeControlsProps = {
  selectionMode: SelectionMode;
  onChangeMode: (mode: SelectionMode) => void;
  showCrosshair: boolean;
};

export function SelectionModeControls({ selectionMode, onChangeMode, showCrosshair }: SelectionModeControlsProps) {
  return (
    <>
      {showCrosshair && (
        <View style={styles.crosshairOverlay} pointerEvents="none">
          <Ionicons name="add" size={40} color="#34C759" />
        </View>
      )}
      <View style={styles.buttonContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.button, selectionMode === 'crosshair' && styles.buttonActive]}
          onPress={() => onChangeMode('crosshair')}
        >
          <Ionicons name="add" size={24} color={selectionMode === 'crosshair' ? 'white' : '#333'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectionMode === 'tap' && styles.buttonActive]}
          onPress={() => onChangeMode('tap')}
        >
          <Ionicons name="hand-left-outline" size={24} color={selectionMode === 'tap' ? 'white' : '#333'} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: 60,
    right: 5,
    flexDirection: 'column',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  buttonActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  crosshairOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    zIndex: 1000,
  },
});
