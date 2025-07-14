import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface FilterTabsProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  variant?: 'default' | 'compact';
}

export function FilterTabs({ options, selectedOption, onSelect, variant = 'default' }: FilterTabsProps) {
  const isCompact = variant === 'compact';
  
  return (
    <View style={[styles.container, isCompact && styles.compactContainer]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  compactContainer: {
    paddingVertical: Spacing.md,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  compactContentContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    minWidth: 80,
    alignItems: 'center',
  },
  compactTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 60,
  },
  selectedTab: {
    backgroundColor: Colors.primary,
  },
  selectedCompactTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
  },
  compactTabText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Medium',
  },
  selectedTabText: {
    color: Colors.surface,
  },
});