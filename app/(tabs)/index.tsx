import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { useMapSelection } from '../hooks/useMapSelection';
import { SpotMarker } from '../components/map/SpotMarker';
import { SelectionModeControls } from '../components/map/SelectionModeControls';
import { ConfirmLocationBar } from '../components/map/ConfirmLocationBar';
import { ReviewFormOverlay } from '../components/map/ReviewFormOverlay';

export default function HomeScreen() {
  const {
    flowState,
    selectionMode,
    spots,
    selectedSpot,
    tempLocation,
    selectedLocation,
    mapCenter,
    mapRef,
    zoom,
    isSelecting,
    isFormVisible,
    isTapConfirmDisabled,
    reviewComment,
    handlePoiClick,
    handleMapPress,
    handleRegionChangeComplete,
    handleConfirmLocation,
    handleSubmitReview,
    enterSelectionMode,
    cancelSelection,
    setSelectionMode,
    setReviewComment,
    selectSpot,
    selectLocation,
  } = useMapSelection();

  const showCrosshair = selectionMode === 'crosshair';
  const showTapSelectionBadge = isSelecting && tempLocation && selectionMode === 'tap';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChargePath</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPoiClick={handlePoiClick}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChangeComplete}
          initialRegion={{
            latitude: 14.5995,
            longitude: 120.9842,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {spots.map((spot) => (
            <SpotMarker
              key={spot.id}
              spot={spot}
              zoom={zoom}
              selected={isSelecting && selectionMode === 'tap' && selectedSpot?.id === spot.id}
              onPress={() => {
                if (flowState === 'selecting' && selectionMode === 'tap') {
                  selectSpot(spot);
                }
              }}
            />
          ))}

          {isFormVisible && selectedLocation && (
            <Marker coordinate={selectedLocation} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
              <View style={styles.confirmedLocationMarker}>
                <View style={styles.confirmBadge}>
                  <Ionicons name="flash" size={16} color="#34C759" />
                </View>
                <View style={styles.tempPinContainer}>
                  <Ionicons name="flash" size={28} color="#34C759" />
                </View>
              </View>
            </Marker>
          )}

          {isSelecting && tempLocation && selectionMode === 'crosshair' && (
            <Marker coordinate={tempLocation} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
              <View style={styles.tempPinContainer}>
                <Ionicons name="flash" size={28} color="#34C759" />
              </View>
            </Marker>
          )}

          {showTapSelectionBadge && (
            <Marker coordinate={tempLocation!} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
              <View style={styles.touchSelectionBadge}>
                <Ionicons name="flash" size={18} color="#34C759" />
              </View>
            </Marker>
          )}
        </MapView>

        {isSelecting && (
          <SelectionModeControls
            selectionMode={selectionMode}
            onChangeMode={(mode) => {
              setSelectionMode(mode);
              if (mode === 'crosshair') {
                selectLocation(mapCenter);
              }
            }}
            showCrosshair={showCrosshair}
          />
        )}
      </View>

      {isSelecting && <ConfirmLocationBar disabled={isTapConfirmDisabled} onConfirm={handleConfirmLocation} />}
      {isFormVisible && (
        <ReviewFormOverlay
          reviewComment={reviewComment}
          onReviewCommentChange={setReviewComment}
          onSubmit={handleSubmitReview}
        />
      )}

      <View style={styles.fabContainer}>
        {flowState === 'idle' ? (
          <TouchableOpacity style={styles.fab} onPress={enterSelectionMode}>
            <Ionicons name="add" size={30} color="#1A1A1A" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.fab, styles.closeFab]} onPress={cancelSelection}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  mapWrapper: { flex: 1, marginHorizontal: 15, marginBottom: 15, borderRadius: 30, overflow: 'hidden', borderWidth: 4, borderColor: 'white', elevation: 5 },
  map: { ...StyleSheet.absoluteFillObject },
  fabContainer: { position: 'absolute', bottom: 30, right: 20, alignItems: 'flex-end' },
  fab: { backgroundColor: 'white', elevation: 5, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  closeFab: { backgroundColor: '#FF3B30' },
  tempPinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBadge: {
    position: 'absolute',
    top: -100,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  tempFlashBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchSelectionBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});
