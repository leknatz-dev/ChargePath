// app/components/map/StartJourneyBar.tsx

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance, formatDuration } from '../../utils/routing';

type StartJourneyBarProps = {
  visible: boolean;
  distanceMeters: number;
  durationSeconds: number;
  onStartJourney: () => void;
  onClearRoute: () => void;
};

export function StartJourneyBar({
  visible,
  distanceMeters,
  durationSeconds,
  onStartJourney,
  onClearRoute,
}: StartJourneyBarProps) {
  const slideAnim = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? -20 : 120,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Route info row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="navigate-outline" size={16} color="#34C759" />
          <Text style={styles.infoText}>{formatDistance(distanceMeters)}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color="#34C759" />
          <Text style={styles.infoText}>{formatDuration(durationSeconds)}</Text>
        </View>

        {/* Clear route button */}
        <TouchableOpacity style={styles.clearButton} onPress={onClearRoute}>
          <Ionicons name="close" size={16} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Start Journey button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={onStartJourney}
        activeOpacity={0.85}
      >
        <Ionicons name="navigate" size={20} color="white" />
        <Text style={styles.startButtonText}>Start Journey</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E5E5E5',
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#34C759',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.3,
  },
});