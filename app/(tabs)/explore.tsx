import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Hardcoded posts for demo
const posts = [
  {
    id: '1',
    image: 'https://via.placeholder.com/300', // Replace with real image URL
    description: 'Great charging spot at 7-Eleven! Fast and reliable.',
    lat: 8.5147,
    lng: 124.5670,
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/300',
    description: 'New spot in the mall, multiple outlets available.',
    lat: 8.5150,
    lng: 124.5680,
  },
];

export default function ExploreScreen() {
  const renderPost = ({ item }: { item: typeof posts[0] }) => (
    <ThemedView style={styles.post}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <ThemedText style={styles.description}>{item.description}</ThemedText>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push(`/?lat=${item.lat}&lng=${item.lng}`);
        }}
      >
        <Text style={styles.buttonText}>View on Map</Text>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  post: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  description: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#34C759',
    padding: 10,
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});