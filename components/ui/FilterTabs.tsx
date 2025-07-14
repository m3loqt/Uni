import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Typography } from '@/constants/theme';

interface FilterTabsProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  variant?: 'default' | 'compact';
}

export function FilterTabs({ options, selectedOption, onSelect, variant = 'default' }: FilterTabsProps) {
  const isCompact = variant === 'compact';
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.contentContainer, isCompact && styles.compactContentContainer]}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.tab,
            isCompact && styles.compactTab,
            selectedOption === option && styles.selectedTab,
            selectedOption === option && isCompact && styles.selectedCompactTab,
          ]}
          onPress={() => onSelect(option)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              isCompact && styles.compactTabText,
              selectedOption === option && styles.selectedTabText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  compactContentContainer: {
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  compactTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 60,
  },
  selectedTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCompactTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.captionMedium.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
  },
  compactTabText: {
    fontSize: Typography.small.fontSize,
    fontFamily: 'Inter-Medium',
  },
  selectedTabText: {
    color: Colors.textInverse,
  },
});