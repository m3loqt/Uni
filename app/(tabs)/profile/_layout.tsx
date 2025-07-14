import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="personal" />
      <Stack.Screen name="medical-history" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="help" />
    </Stack>
  );
}