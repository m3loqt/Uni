import { Tabs } from 'expo-router';
import { Chrome as Home, Calendar, FileText, Award, User } from 'lucide-react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          paddingBottom: Spacing.md,
          paddingTop: Spacing.md,
          height: 88,
          shadowColor: Colors.gray900,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: FontSizes.xs,
          fontFamily: 'Inter-Medium',
          marginTop: Spacing.xs,
        },
        tabBarIconStyle: {
          marginTop: Spacing.xs,
        },
        tabBarItemStyle: {
          paddingVertical: Spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 32,
              height: 32,
              borderRadius: BorderRadius.md,
              backgroundColor: focused ? `${Colors.primary}15` : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Home size={size - 2} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 32,
              height: 32,
              borderRadius: BorderRadius.md,
              backgroundColor: focused ? `${Colors.primary}15` : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Calendar size={size - 2} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="prescriptions"
        options={{
          title: 'Prescription',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 32,
              height: 32,
              borderRadius: BorderRadius.md,
              backgroundColor: focused ? `${Colors.primary}15` : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <FileText size={size - 2} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="certificates"
        options={{
          title: 'Med Certs',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 32,
              height: 32,
              borderRadius: BorderRadius.md,
              backgroundColor: focused ? `${Colors.primary}15` : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Award size={size - 2} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 32,
              height: 32,
              borderRadius: BorderRadius.md,
              backgroundColor: focused ? `${Colors.primary}15` : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <User size={size - 2} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}