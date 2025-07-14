import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { user, userRole, isLoading } = useAuthStore();

  useEffect(() => {
    // Add a small delay to ensure the navigation system is ready
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user && userRole) {
          // Navigate based on user role
          if (userRole === 'doctor') {
            router.replace('/(doctor-tabs)');
          } else {
            router.replace('/(tabs)');
          }
        } else {
          router.replace('/(auth)/signin');
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, userRole, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
});