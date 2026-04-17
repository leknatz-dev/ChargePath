import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ConfirmLocationBarProps = {
  disabled: boolean;
  onConfirm: () => void;
};

export function ConfirmLocationBar({ disabled, onConfirm }: ConfirmLocationBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onConfirm}
        style={[styles.confirmButton, disabled && styles.disabledButton]}
      >
        <Ionicons name="checkmark" size={20} color={disabled ? '#999' : '#1A1A1A'} style={styles.confirmIcon} />
        <Text style={[styles.confirmButtonText, disabled && styles.disabledText]}>Confirm Location</Text>
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
    alignItems: 'center',
  },
  confirmButton: {
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  confirmIcon: {
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
});
