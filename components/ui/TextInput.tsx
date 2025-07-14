import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function TextInput({ icon, rightIcon, style, ...rest }: CustomTextInputProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <RNTextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
});