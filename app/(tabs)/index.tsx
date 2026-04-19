import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { useMapSelection } from '../hooks/useMapSelection';
import { SpotMarker, GhostMarker } from '../components/map/SpotMarker';
import { SelectionModeControls } from '../components/map/SelectionModeControls';
import { ConfirmLocationBar } from '../components/map/ConfirmLocationBar';
import { ReviewFormOverlay } from '../components/map/ReviewFormOverlay';
import { SpotDetailSheet } from '../components/map/SpotDetailSheet';
import { SelectionPill } from '../components/map/SelectionPill';

const WAZE_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e5f5e0' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#ffe082' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: '#e5e5e5' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9e9f6' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
];

export default function HomeScreen() {
  const {
    mapRef,
    OPOL_REGION,
    zoom,
    spots,
    flowState,
    selectionMode,
    selectedSpot,
    tempLocation,
    isSelecting,
    isFormVisible,
    isTapConfirmDisabled,
    showCrosshair,
    reviewComment,
    price,
    detailSpot,
    isDetailVisible,
    handlePoiClick,
    handleMapPress,
    handleRegionChangeComplete,
    handleSpotMarkerPress,
    handleConfirmLocation,
    handleSubmitReview,
    enterSelectionMode,
    enterReviewMode,
    cancelSelection,
    closeDetailSheet,
    setSelectionMode,
    setReviewComment,
    setPrice,
    openDetailSheet,
  } = useMapSelection();

  return (
    <SafeAreaView style={styles.container}>

      {/* ------------------------------------------------------------------ */}
      {/* Floating Header */}
      {/* ------------------------------------------------------------------ */}
      {!isFormVisible && (
        <View style={styles.header} pointerEvents="box-none">
          {/* Left — Avatar */}
          <TouchableOpacity style={styles.avatarButton}>
            <Ionicons name="person" size={18} color="#888" />
          </TouchableOpacity>

          {/* Center — Location text + Selection Pill */}
          <View style={styles.headerCenter} pointerEvents="box-none">
            {/* Location text — hides when pill is visible */}
            {!isSelecting && (
              <View style={styles.locationWrapper}>
                <Text style={styles.yourLocationLabel}>Your Location</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="navigate" size={12} color="#34C759" />
                  <Text style={styles.locationText}>Opol, Misamis Oriental</Text>
                </View>
              </View>
            )}

            {/* Selection pill slides in from right */}
            {isSelecting && (
              <SelectionPill
                visible={isSelecting}
                selectionMode={selectionMode}
                onChangeMode={(mode) => setSelectionMode(mode)}
              />
            )}
          </View>

          {/* Right — Lightning bolt toggle */}
          <TouchableOpacity
            style={[styles.toggleButton, isSelecting && styles.toggleButtonActive]}
            onPress={isSelecting ? cancelSelection : enterSelectionMode}
            activeOpacity={0.8}
          >
            <Ionicons
              name="flash"
              size={20}
              color={isSelecting ? 'white' : '#1A1A1A'}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Map — full screen */}
      {/* ------------------------------------------------------------------ */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation
          showsMyLocationButton={false}
          onPoiClick={handlePoiClick}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChangeComplete}
          initialRegion={OPOL_REGION}
          toolbarEnabled={false}
          customMapStyle={WAZE_MAP_STYLE}
        >
          {spots.map((spot) => (
            <SpotMarker
              key={spot.id}
              spot={spot}
              zoom={zoom}
              selected={
                isSelecting &&
                selectionMode === 'tap' &&
                selectedSpot?.id === spot.id
              }
              onPress={handleSpotMarkerPress}
            />
          ))}

          {isSelecting && tempLocation && (
            <GhostMarker
              coordinate={tempLocation}
              selectionMode={selectionMode}
            />
          )}
        </MapView>

        {/* Crosshair overlay — only in crosshair mode */}
        {isSelecting && (
          <SelectionModeControls
            selectionMode={selectionMode}
            showCrosshair={showCrosshair}
            onChangeMode={(mode) => setSelectionMode(mode)}
          />
        )}
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Confirm location bar */}
      {/* ------------------------------------------------------------------ */}
      {isSelecting && (
        <ConfirmLocationBar
          disabled={isTapConfirmDisabled}
          selectionMode={selectionMode}
          onConfirm={handleConfirmLocation}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Review form */}
      {/* ------------------------------------------------------------------ */}
      {isFormVisible && (
  <ReviewFormOverlay
    selectedSpot={selectedSpot}
    selectionMode={selectionMode}
    reviewComment={reviewComment}
    price={price}
    onReviewCommentChange={setReviewComment}
    onPriceChange={setPrice}
    onSubmit={handleSubmitReview}
    onCancel={cancelSelection}
  />
)}

      {/* ------------------------------------------------------------------ */}
      {/* Spot Detail Sheet */}
      {/* ------------------------------------------------------------------ */}
      <SpotDetailSheet
        spot={detailSpot}
        visible={isDetailVisible}
        onClose={closeDetailSheet}
        onAddReview={(spot) => enterReviewMode(spot)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Floating header — sits on top of map
  header: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },

  // Location text
  locationWrapper: {
    alignItems: 'center',
  },
  yourLocationLabel: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Avatar button
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  // Lightning toggle button
  toggleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  toggleButtonActive: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOpacity: 0.4,
  },

  // Map — full screen, no margins
  mapWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});