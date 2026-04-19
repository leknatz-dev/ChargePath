import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SelectionMode } from '../../types/map';

type SelectionPillProps = {
  visible: boolean;
  selectionMode: SelectionMode;
  onChangeMode: (mode: SelectionMode) => void;
};

export function SelectionPill({ visible, selectionMode, onChangeMode }: SelectionPillProps) {
  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 200,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.pill,
        { transform: [{ translateX: slideAnim }] },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Crosshair mode button */}
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectionMode === 'crosshair' && styles.modeButtonActive,
          selectionMode !== 'crosshair' && styles.modeButtonInactive,
        ]}
        onPress={() => onChangeMode('crosshair')}
        activeOpacity={0.8}
      >
        <Ionicons
          name="scan-outline"
          size={20}
          color={selectionMode === 'crosshair' ? '#1A1A1A' : 'rgba(255,255,255,0.5)'}
        />
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Tap mode button */}
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectionMode === 'tap' && styles.modeButtonActive,
          selectionMode !== 'tap' && styles.modeButtonInactive,
        ]}
        onPress={() => onChangeMode('tap')}
        activeOpacity={0.8}
      >
        <Ionicons
          name="hand-left-outline"
          size={20}
          color={selectionMode === 'tap' ? '#1A1A1A' : 'rgba(255,255,255,0.5)'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    backgroundColor: '#34C759',
    borderRadius: 30,
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#34C759',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: 'white',
  },
  modeButtonInactive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});