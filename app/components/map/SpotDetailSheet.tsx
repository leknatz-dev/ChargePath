import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Spot, Review } from '../../types/map';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.62;

type SpotDetailSheetProps = {
  spot: Spot | null;
  visible: boolean;
  onClose: () => void;
  onAddReview: (spot: Spot) => void;
};

export function SpotDetailSheet({ spot, visible, onClose, onAddReview }: SpotDetailSheetProps) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!spot) return null;

  const statusColor =
    spot.status === 'verified' ? '#34C759'
    : spot.status === 'unverified' ? '#FF9500'
    : '#007AFF';

  const statusLabel =
    spot.status === 'verified' ? 'Verified'
    : spot.status === 'unverified' ? 'Unverified'
    : 'Establishment';

  const typeLabel = spot.type === 'hybrid' ? 'Business Outlet' : 'Standalone Spot';
  const typeIcon = spot.type === 'hybrid' ? 'business-outline' : 'flash-outline';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle bar */}
        <View style={styles.handleBar} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              {/* Type badge */}
              <View style={styles.typeBadgeRow}>
                <Ionicons name={typeIcon} size={13} color="#666" />
                <Text style={styles.typeBadgeText}>{typeLabel}</Text>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
              </View>

              <Text style={styles.spotName}>{spot.name}</Text>

              {spot.address ? (
                <View style={styles.addressRow}>
                  <Ionicons name="location-outline" size={13} color="#888" />
                  <Text style={styles.addressText}>{spot.address}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Info cards row */}
          <View style={styles.infoRow}>
            <InfoCard
              icon="flash"
              iconColor="#34C759"
              label="Price"
              value={spot.price ?? 'Unknown'}
            />
            <InfoCard
              icon="checkmark-circle"
              iconColor="#007AFF"
              label="Verified by"
              value={`${spot.verificationCount ?? 0} riders`}
            />
            <InfoCard
              icon="time-outline"
              iconColor="#FF9500"
              label="Added"
              value={spot.createdAt ?? '—'}
            />
          </View>

          {/* Outlet description */}
          {spot.outletDescription ? (
            <Section title="Outlet">
              <Text style={styles.bodyText}>{spot.outletDescription}</Text>
            </Section>
          ) : null}

          {/* Tips */}
          {spot.tips ? (
            <Section title="Rider Tips">
              <View style={styles.tipsBox}>
                <Ionicons name="bulb-outline" size={16} color="#FF9500" style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={styles.tipsText}>{spot.tips}</Text>
              </View>
            </Section>
          ) : null}

          {/* Photos placeholder */}
          <Section title="Photos">
            {spot.photos && spot.photos.length > 0 ? (
              <Text style={styles.bodyText}>{spot.photos.length} photo(s)</Text>
            ) : (
              <View style={styles.photosPlaceholder}>
                <Ionicons name="camera-outline" size={28} color="#ccc" />
                <Text style={styles.photosPlaceholderText}>No photos yet</Text>
              </View>
            )}
          </Section>

          {/* Reviews */}
          <Section title={`Reviews (${spot.reviews?.length ?? 0})`}>
            {spot.reviews && spot.reviews.length > 0 ? (
              spot.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <Text style={styles.emptyText}>No reviews yet. Be the first!</Text>
            )}
          </Section>
        </ScrollView>

        {/* Action buttons */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => onAddReview(spot)}
          >
            <Ionicons name="create-outline" size={18} color="#34C759" />
            <Text style={[styles.actionButtonText, { color: '#34C759' }]}>Add Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => {
              // Placeholder — routing implemented in Phase 3
              onClose();
            }}
          >
            <Ionicons name="navigate" size={18} color="white" />
            <Text style={[styles.actionButtonText, { color: 'white' }]}>Add to Route</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoCard({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text style={styles.infoCardLabel}>{label}</Text>
      <Text style={styles.infoCardValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{review.author[0].toUpperCase()}</Text>
        </View>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <View style={styles.starsRow}>
            {stars.map((filled, i) => (
              <Ionicons
                key={i}
                name={filled ? 'star' : 'star-outline'}
                size={12}
                color="#FFD700"
              />
            ))}
            <Text style={styles.reviewDate}> · {review.createdAt}</Text>
          </View>
        </View>
        {review.price ? (
          <View style={styles.reviewPriceBadge}>
            <Text style={styles.reviewPriceText}>{review.price}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    color: '#666',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  spotName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addressText: {
    fontSize: 13,
    color: '#888',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info cards
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  infoCardLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  infoCardValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },

  // Tips
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9F0',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },

  // Photos
  photosPlaceholder: {
    height: 90,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  photosPlaceholderText: {
    fontSize: 13,
    color: '#bbb',
  },

  // Reviews
  emptyText: {
    fontSize: 13,
    color: '#aaa',
    fontStyle: 'italic',
  },
  reviewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reviewAvatarText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: '#999',
  },
  reviewPriceBadge: {
    backgroundColor: '#E8F8EE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reviewPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34C759',
  },
  reviewComment: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },

  // Action bar
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    gap: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: '#34C759',
  },
  actionButtonSecondary: {
    backgroundColor: '#F0FBF4',
    borderWidth: 1.5,
    borderColor: '#34C759',
  },
  actionButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
});