import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SelectionMode } from '../../types/map';

type ConfirmLocationBarProps = {
  disabled: boolean;
  selectionMode: SelectionMode;
  onConfirm: () => void;
};

export function ConfirmLocationBar({ disabled, selectionMode, onConfirm }: ConfirmLocationBarProps) {
  const label =
    selectionMode === 'crosshair'
      ? 'Confirm This Location'
      : disabled
      ? 'Tap a spot on the map'
      : 'Confirm Selected Spot';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onConfirm}
        style={[styles.confirmButton, disabled && styles.disabledButton]}
        activeOpacity={0.8}
      >
        <Ionicons
          name="checkmark-circle"
          size={22}
          color={disabled ? '#bbb' : '#1A1A1A'}
          style={styles.icon}
        />
        <Text style={[styles.confirmButtonText, disabled && styles.disabledText]}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 90,
  },
  confirmButton: {
    height: 56,
    backgroundColor: 'white',
    elevation: 6,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  icon: {
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 15,
  },
  disabledButton: {
    borderColor: '#ddd',
    opacity: 0.6,
  },
  disabledText: {
    color: '#bbb',
  },
});