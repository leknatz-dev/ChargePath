import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_SPOTS, type Spot } from '../types/map';

type ExploreFilter = 'all' | 'verified' | 'nearest' | 'free' | 'amenities';

type FeedItem = {
  id: string;
  spotId: string;
  spotName: string;
  status: Spot['status'];
  latitude: number;
  longitude: number;
  author: string;
  postedAt: string;
  text: string;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  hasAmenities: boolean;
  isFree: boolean;
  distanceKm: number;
};

const FEED_PREVIEW: FeedItem[] = [
  {
    id: 'feed-1',
    spotId: 'mock-1',
    spotName: '7-Eleven Charging Outlet',
    status: 'verified',
    latitude: 8.5155,
    longitude: 124.5663,
    author: 'JuanRider',
    postedAt: '2h ago',
    text: '2 outlets active near cashier. Charging is free if you buy anything.',
    likeCount: 14,
    isLiked: false,
    isBookmarked: true,
    hasAmenities: true,
    isFree: true,
    distanceKm: 0.4,
  },
  {
    id: 'feed-2',
    spotId: 'mock-2',
    spotName: 'Opol Public Market Outlet',
    status: 'verified',
    latitude: 8.513,
    longitude: 124.569,
    author: 'EbikeOpol',
    postedAt: '5h ago',
    text: 'Still available today. Caretaker fee is P10 per hour.',
    likeCount: 9,
    isLiked: true,
    isBookmarked: false,
    hasAmenities: false,
    isFree: false,
    distanceKm: 0.8,
  },
  {
    id: 'feed-3',
    spotId: 'mock-3',
    spotName: 'Cafe Uno Charging Corner',
    status: 'verified',
    latitude: 8.5168,
    longitude: 124.5645,
    author: 'ScoutRider',
    postedAt: '1d ago',
    text: 'Fast charging and comfy seating. Good stop while waiting.',
    likeCount: 21,
    isLiked: false,
    isBookmarked: false,
    hasAmenities: true,
    isFree: true,
    distanceKm: 1.1,
  },
  {
    id: 'feed-4',
    spotId: 'mock-4',
    spotName: 'Roadside Post near Barangay Hall',
    status: 'unverified',
    latitude: 8.511,
    longitude: 124.571,
    author: 'RoadScoutPH',
    postedAt: '1d ago',
    text: 'Saw one outlet on post. Needs more riders to verify reliability.',
    likeCount: 3,
    isLiked: false,
    isBookmarked: false,
    hasAmenities: false,
    isFree: false,
    distanceKm: 1.4,
  },
  {
    id: 'feed-5',
    spotId: 'mock-5',
    spotName: 'SM CDC Charging Bay',
    status: 'establishment',
    latitude: 8.5175,
    longitude: 124.563,
    author: 'OpsolScout01',
    postedAt: '2d ago',
    text: 'Official charging bay, secured and covered. Easy parking access.',
    likeCount: 32,
    isLiked: true,
    isBookmarked: true,
    hasAmenities: true,
    isFree: false,
    distanceKm: 1.8,
  },
];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState<ExploreFilter>('all');
  const [feedItems, setFeedItems] = useState<FeedItem[]>(FEED_PREVIEW);

  const knownSpotIds = useMemo(() => new Set(DEFAULT_SPOTS.map((spot) => spot.id)), []);

  const filteredFeed = useMemo(() => {
    if (activeFilter === 'nearest') {
      return [...feedItems].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    if (activeFilter === 'verified') {
      return feedItems.filter((item) => item.status === 'verified' || item.status === 'establishment');
    }

    if (activeFilter === 'free') {
      return feedItems.filter((item) => item.isFree);
    }

    if (activeFilter === 'amenities') {
      return feedItems.filter((item) => item.hasAmenities);
    }

    return feedItems;
  }, [activeFilter, feedItems]);

  const toggleLike = (itemId: string) => {
    setFeedItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        const nextLiked = !item.isLiked;
        return {
          ...item,
          isLiked: nextLiked,
          likeCount: nextLiked ? item.likeCount + 1 : Math.max(0, item.likeCount - 1),
        };
      })
    );
  };

  const toggleBookmark = (itemId: string) => {
    setFeedItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  const handleViewOnMap = (item: FeedItem) => {
    const hasExistingSpot = knownSpotIds.has(item.spotId);
    if (hasExistingSpot) {
      router.push(`/?lat=${item.latitude}&lng=${item.longitude}`);
      return;
    }

    router.push(`/?lat=${item.latitude}&lng=${item.longitude}`);
  };

  const renderFilter = (filter: ExploreFilter, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
      onPress={() => setActiveFilter(filter)}
      activeOpacity={0.85}
    >
      <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: FeedItem }) => (
    <ThemedView style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.authorBlock}>
          <View style={styles.avatar}>
            <Ionicons name="flash" size={14} color="#34C759" />
          </View>
          <View>
            <ThemedText style={styles.author}>{item.author}</ThemedText>
            <Text style={styles.meta}>
              {item.spotName} · {item.postedAt}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'unverified' ? styles.unverifiedBadge : styles.verifiedBadge,
          ]}
        >
          <Text style={styles.statusBadgeText}>
            {item.status === 'unverified' ? 'Unverified' : 'Verified'}
          </Text>
        </View>
      </View>

      <ThemedText style={styles.description}>{item.text}</ThemedText>

      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Ionicons name="location-outline" size={13} color="#6B7280" />
          <Text style={styles.tagText}>{item.distanceKm.toFixed(1)} km away</Text>
        </View>
        {item.isFree && (
          <View style={styles.tag}>
            <Ionicons name="pricetag-outline" size={13} color="#34C759" />
            <Text style={styles.tagText}>Free charging</Text>
          </View>
        )}
        {item.hasAmenities && (
          <View style={styles.tag}>
            <Ionicons name="cafe-outline" size={13} color="#6B7280" />
            <Text style={styles.tagText}>Amenities</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={17}
            color={item.isLiked ? '#E5484D' : '#52525B'}
          />
          <Text style={styles.actionText}>{item.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => toggleBookmark(item.id)}>
          <Ionicons
            name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={17}
            color={item.isBookmarked ? '#34C759' : '#52525B'}
          />
          <Text style={styles.actionText}>{item.isBookmarked ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapButton} onPress={() => handleViewOnMap(item)}>
          <Ionicons name="map-outline" size={16} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>View on Map</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.topSection}>
        <ThemedText type="title" style={styles.title}>Explore</ThemedText>
        <ThemedText style={styles.subtitle}>Recent charging spot updates around Opol</ThemedText>
        <View style={styles.filterRow}>
          {renderFilter('all', 'All')}
          {renderFilter('verified', 'Verified')}
          {renderFilter('nearest', 'Nearest')}
          {renderFilter('free', 'Free')}
          {renderFilter('amenities', 'Amenities')}
        </View>
      </View>
      <FlatList
        data={filteredFeed}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  topSection: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 12,
    fontSize: 13,
    color: '#6B7280',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 120,
  },
  post: {
    marginVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  authorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EAF9EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  meta: {
    marginTop: 1,
    fontSize: 11,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  verifiedBadge: {
    backgroundColor: '#EAF9EE',
  },
  unverifiedBadge: {
    backgroundColor: '#FFF6E6',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#1F2937',
  },
  tagsRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  tagText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  mapButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});