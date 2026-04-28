import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DEFAULT_SPOTS } from '../types/map';

type ActivityItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  time: string;
};

const MOCK_PROFILE = {
  displayName: 'Opol Rider',
  handle: '@opol_scout_01',
  level: 'Community Scout',
};

const MOCK_STATS = {
  spotsSubmitted: 6,
  reviewsPosted: 14,
  verificationHelp: 9,
  savedSpots: 3,
};

const SAVED_SPOT_IDS = ['mock-1', 'mock-3', 'mock-5'];

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    icon: 'bookmark',
    text: 'Saved 7-Eleven Charging Outlet',
    time: '2h ago',
  },
  {
    id: 'a2',
    icon: 'chatbubble-ellipses',
    text: 'Posted a review on Cafe Uno Charging Corner',
    time: '1d ago',
  },
  {
    id: 'a3',
    icon: 'checkmark-circle',
    text: 'Helped verify Opol Public Market Outlet',
    time: '2d ago',
  },
];

export default function ProfileScreen() {
  const savedSpots = useMemo(
    () => DEFAULT_SPOTS.filter((spot) => SAVED_SPOT_IDS.includes(spot.id)),
    []
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={26} color="#4B5563" />
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.name}>{MOCK_PROFILE.displayName}</Text>
          <Text style={styles.handle}>{MOCK_PROFILE.handle}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{MOCK_PROFILE.level}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard value={MOCK_STATS.spotsSubmitted} label="Spots Added" />
        <StatCard value={MOCK_STATS.reviewsPosted} label="Reviews" />
        <StatCard value={MOCK_STATS.verificationHelp} label="Verifications" />
        <StatCard value={MOCK_STATS.savedSpots} label="Saved Spots" />
      </View>

      <SectionTitle title="Saved/Bookmarked Spots" />
      <View style={styles.sectionCard}>
        {savedSpots.map((spot) => (
          <View key={spot.id} style={styles.savedSpotRow}>
            <View style={styles.savedSpotLeft}>
              <Ionicons
                name={spot.type === 'hybrid' ? 'storefront-outline' : 'flash-outline'}
                size={18}
                color="#34C759"
              />
              <View style={styles.savedSpotTextWrap}>
                <Text style={styles.savedSpotName}>{spot.name}</Text>
                <Text style={styles.savedSpotMeta}>
                  {spot.status === 'verified' || spot.status === 'establishment'
                    ? 'Verified'
                    : 'Unverified'}
                  {' · '}
                  {spot.address ?? 'Opol, Misamis Oriental'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => router.push(`/?lat=${spot.latitude}&lng=${spot.longitude}`)}
            >
              <Ionicons name="map-outline" size={14} color="#FFFFFF" />
              <Text style={styles.mapButtonText}>Map</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <SectionTitle title="Recent Activity" />
      <View style={styles.sectionCard}>
        {RECENT_ACTIVITY.map((activity, index) => (
          <View
            key={activity.id}
            style={[
              styles.activityRow,
              index !== RECENT_ACTIVITY.length - 1 && styles.activityRowBorder,
            ]}
          >
            <View style={styles.activityIcon}>
              <Ionicons name={activity.icon} size={15} color="#34C759" />
            </View>
            <View style={styles.activityTextWrap}>
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

type StatCardProps = {
  value: number;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type SectionTitleProps = {
  title: string;
};

function SectionTitle({ title }: SectionTitleProps) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  handle: {
    marginTop: 1,
    fontSize: 12,
    color: '#6B7280',
  },
  levelBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#EAF9EE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  statsGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  savedSpotRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  savedSpotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  savedSpotTextWrap: {
    flex: 1,
  },
  savedSpotName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  savedSpotMeta: {
    marginTop: 1,
    fontSize: 11,
    color: '#6B7280',
  },
  mapButton: {
    backgroundColor: '#34C759',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  activityRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
  },
  activityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  activityIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAF9EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextWrap: {
    flex: 1,
  },
  activityText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  activityTime: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
  },
});