import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: any;
}

export function LoadingSpinner({ 
  size = 'large', 
  color = Colors.primary, 
  style 
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});