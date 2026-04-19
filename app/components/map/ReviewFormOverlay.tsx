import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type {
  Spot,
  PriceRange,
  FeeType,
  OutletType,
  AccessType,
  ParkingType,
  AmenityType,
  VibeType,
} from '../../types/map';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ReviewFormOverlayProps = {
  selectedSpot: Spot | null;
  selectionMode: 'tap' | 'crosshair';
  reviewComment: string;
  price: string;
  onReviewCommentChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSubmit: (formData: ReviewFormData) => void;
  onCancel: () => void;
};

export type ReviewFormData = {
  priceRange?: PriceRange;
  feeType?: FeeType;
  outletTypes: OutletType[];
  accessType?: AccessType;
  parkingTypes: ParkingType[];
  amenities: AmenityType[];
  vibe?: VibeType;
  notes: string;
};

// ---------------------------------------------------------------------------
// Chip option definitions
// ---------------------------------------------------------------------------
const PRICE_OPTIONS: { label: string; value: PriceRange }[] = [
  { label: 'Free', value: 'free' },
  { label: 'P1–P20', value: 'p1-p20' },
  { label: 'P21–P50', value: 'p21-p50' },
  { label: 'P50+', value: 'p50+' },
];

const FEE_OPTIONS: { label: string; value: FeeType }[] = [
  { label: 'Per Hour', value: 'per_hour' },
  { label: 'Metered', value: 'metered' },
  { label: 'Flat Rate', value: 'flat_rate' },
  { label: 'Free', value: 'free' },
];

const OUTLET_OPTIONS: { label: string; value: OutletType; icon: string }[] = [
  { label: 'Standard Wall', value: 'standard_wall', icon: 'flash-outline' },
  { label: 'Extension Cord', value: 'extension_cord', icon: 'git-branch-outline' },
  { label: 'USB-A', value: 'usb_a', icon: 'hardware-chip-outline' },
  { label: 'USB-C', value: 'usb_c', icon: 'hardware-chip-outline' },
];

const ACCESS_OPTIONS: { label: string; value: AccessType; icon: string }[] = [
  { label: 'Public', value: 'public', icon: 'earth-outline' },
  { label: 'Ask Staff', value: 'ask_staff', icon: 'chatbubble-outline' },
  { label: 'Purchase Required', value: 'purchase_required', icon: 'bag-outline' },
];

const PARKING_OPTIONS: { label: string; value: ParkingType; icon: string }[] = [
  { label: 'Roadside', value: 'roadside', icon: 'car-outline' },
  { label: 'E-Bike Slot', value: 'dedicated_ebike_slot', icon: 'bicycle-outline' },
  { label: 'Covered/Indoor', value: 'covered_indoor', icon: 'business-outline' },
];

const AMENITY_OPTIONS: { label: string; value: AmenityType; icon: string }[] = [
  { label: 'WiFi', value: 'wifi', icon: 'wifi-outline' },
  { label: 'Restroom', value: 'restroom', icon: 'water-outline' },
  { label: 'Seating', value: 'seating_area', icon: 'cafe-outline' },
  { label: 'Aircon', value: 'aircon', icon: 'snow-outline' },
  { label: 'CCTV', value: 'cctv_secured', icon: 'shield-checkmark-outline' },
];

const VIBE_OPTIONS: { label: string; value: VibeType; emoji: string }[] = [
  { label: 'Friendly', value: 'friendly', emoji: '👍' },
  { label: 'Neutral', value: 'neutral', emoji: '😐' },
  { label: 'Unfriendly', value: 'unfriendly', emoji: '😤' },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function ReviewFormOverlay({
  selectedSpot,
  selectionMode,
  onSubmit,
  onCancel,
}: ReviewFormOverlayProps) {
  // Form state
  const [priceRange, setPriceRange] = useState<PriceRange | undefined>();
  const [feeType, setFeeType] = useState<FeeType | undefined>();
  const [outletTypes, setOutletTypes] = useState<OutletType[]>([]);
  const [accessType, setAccessType] = useState<AccessType | undefined>();
  const [parkingTypes, setParkingTypes] = useState<ParkingType[]>([]);
  const [amenities, setAmenities] = useState<AmenityType[]>([]);
  const [vibe, setVibe] = useState<VibeType | undefined>();
  const [notes, setNotes] = useState('');

  const isExisting = !!selectedSpot;
  const spotTypeLabel = isExisting
    ? selectedSpot.name
    : selectionMode === 'crosshair'
    ? 'New Standalone Spot'
    : 'New Business Outlet';

  // Toggle multi-select
  function toggleMulti<T>(current: T[], value: T): T[] {
    return current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
  }

  const handleSubmit = () => {
    onSubmit({
      priceRange,
      feeType,
      outletTypes,
      accessType,
      parkingTypes,
      amenities,
      vibe,
      notes,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.handleBar} />
          <View style={styles.headerRow}>
            <View style={styles.headerIconWrap}>
              <Ionicons
                name={isExisting ? 'create-outline' : selectionMode === 'crosshair' ? 'flash' : 'business-outline'}
                size={18}
                color="#34C759"
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerLabel}>
                {isExisting ? 'Add a Review' : 'Add New Spot'}
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                {spotTypeLabel}
              </Text>
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.cancelIcon}>
              <Ionicons name="close" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable form */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Price Range */}
          <FormSection title="Price Range">
            <View style={styles.chipRow}>
              {PRICE_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={priceRange === opt.value}
                  onPress={() => setPriceRange(priceRange === opt.value ? undefined : opt.value)}
                />
              ))}
            </View>
          </FormSection>

          {/* Fee Type */}
          <FormSection title="Fee Type">
            <View style={styles.chipRow}>
              {FEE_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={feeType === opt.value}
                  onPress={() => setFeeType(feeType === opt.value ? undefined : opt.value)}
                />
              ))}
            </View>
          </FormSection>

          {/* Outlet Type */}
          <FormSection title="Outlet Type">
            <View style={styles.chipRow}>
              {OUTLET_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon as any}
                  selected={outletTypes.includes(opt.value)}
                  onPress={() => setOutletTypes(toggleMulti(outletTypes, opt.value))}
                  multi
                />
              ))}
            </View>
          </FormSection>

          {/* Access */}
          <FormSection title="Access">
            <View style={styles.chipRow}>
              {ACCESS_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon as any}
                  selected={accessType === opt.value}
                  onPress={() => setAccessType(accessType === opt.value ? undefined : opt.value)}
                />
              ))}
            </View>
          </FormSection>

          {/* Parking */}
          <FormSection title="Parking">
            <View style={styles.chipRow}>
              {PARKING_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon as any}
                  selected={parkingTypes.includes(opt.value)}
                  onPress={() => setParkingTypes(toggleMulti(parkingTypes, opt.value))}
                  multi
                />
              ))}
            </View>
          </FormSection>

          {/* Amenities */}
          <FormSection title="Amenities">
            <View style={styles.chipRow}>
              {AMENITY_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon as any}
                  selected={amenities.includes(opt.value)}
                  onPress={() => setAmenities(toggleMulti(amenities, opt.value))}
                  multi
                />
              ))}
            </View>
          </FormSection>

          {/* Vibe */}
          <FormSection title="Vibe">
            <View style={styles.chipRow}>
              {VIBE_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={`${opt.emoji} ${opt.label}`}
                  selected={vibe === opt.value}
                  onPress={() => setVibe(vibe === opt.value ? undefined : opt.value)}
                />
              ))}
            </View>
          </FormSection>

          {/* Notes */}
          <FormSection title="Additional Notes">
            <TextInput
              style={styles.notesInput}
              placeholder="Any tips for other riders..."
              placeholderTextColor="#bbb"
              value={notes}
              onChangeText={setNotes}
              multiline
              returnKeyType="done"
              blurOnSubmit
            />
          </FormSection>

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.submitButtonText}>
              {isExisting ? 'Submit Review' : 'Pin This Spot'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Sub components
// ---------------------------------------------------------------------------
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  multi?: boolean;
};

function Chip({ label, selected, onPress, icon, multi }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={13}
          color={selected ? 'white' : '#666'}
          style={{ marginRight: 4 }}
        />
      )}
      {multi && selected && (
        <Ionicons
          name="checkmark"
          size={11}
          color="white"
          style={{ marginRight: 3 }}
        />
      )}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  keyboardView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    maxHeight: '100%',
  },

  // Header
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FBF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  cancelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  chipSelected: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  chipTextSelected: {
    color: 'white',
  },

  // Notes
  notesInput: {
    minHeight: 80,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },

  // Submit
  submitButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
});