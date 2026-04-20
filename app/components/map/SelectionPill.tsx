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
  Animated.timing(slideAnim, {
    toValue: visible ? 0 : 200,
    duration: 250,
    useNativeDriver: true,
  }).start();
}, [visible]);

  return (
    <Animated.View
      style={[
        styles.pillWrapper,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <View style={styles.pill}>
        {/* Crosshair mode button */}
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectionMode === 'crosshair'
              ? styles.modeButtonActive
              : styles.modeButtonInactive,
          ]}
          onPress={() => onChangeMode('crosshair')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="scan-outline"
            size={20}
            color={selectionMode === 'crosshair' ? '#1A1A1A' : 'rgba(255,255,255,0.6)'}
          />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Tap mode button */}
        <TouchableOpacity
          style={[
            styles.modeButton,
            selectionMode === 'tap'
              ? styles.modeButtonActive
              : styles.modeButtonInactive,
          ]}
          onPress={() => onChangeMode('tap')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="hand-left-outline"
            size={20}
            color={selectionMode === 'tap' ? '#1A1A1A' : 'rgba(255,255,255,0.6)'}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pillWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    width: 44,
    height: 44,
    borderRadius: 22,
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