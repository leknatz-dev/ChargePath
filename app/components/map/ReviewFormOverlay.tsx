import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type ReviewFormOverlayProps = {
  reviewComment: string;
  onReviewCommentChange: (value: string) => void;
  onSubmit: () => void;
};

export function ReviewFormOverlay({ reviewComment, onReviewCommentChange, onSubmit }: ReviewFormOverlayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Comments"
        placeholderTextColor="#999"
        value={reviewComment}
        onChangeText={onReviewCommentChange}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  input: {
    minHeight: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 16,
    color: '#111',
  },
  submitButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#34C759',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
