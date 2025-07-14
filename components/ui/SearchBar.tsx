import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ placeholder, value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={20} color={Colors.textTertiary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
  },
});