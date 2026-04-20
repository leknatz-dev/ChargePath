import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { SelectionMode } from '../../types/map';

type ConfirmLocationBarProps = {
  visible: boolean;
  disabled: boolean;
  selectionMode: SelectionMode;
  onConfirm: () => void;
};

export function ConfirmLocationBar({ visible, disabled, selectionMode, onConfirm }: ConfirmLocationBarProps) {
  const slideAnim = useRef(new Animated.Value(80)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 180,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const label =
    selectionMode === 'crosshair'
      ? 'Confirm Location'
      : disabled
      ? 'Tap a spot on the map'
      : 'Confirm Spot';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={onConfirm}
        activeOpacity={0.8}
        style={[styles.pill, disabled && styles.pillDisabled]}
      >
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    height: 50,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  pillDisabled: {
    backgroundColor: 'rgba(52, 199, 89, 0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  labelDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
});