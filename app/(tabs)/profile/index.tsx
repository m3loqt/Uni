import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Settings, User, FileText, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Camera, CreditCard as Edit } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

export default function ProfileScreen() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      icon: <User size={24} color={Colors.textSecondary} />,
      title: 'Personal Information',
      subtitle: 'Update your details',
      onPress: () => router.push('/(tabs)/profile/personal'),
    },
    {
      icon: <FileText size={24} color={Colors.textSecondary} />,
      title: 'Medical History',
      subtitle: 'View your records',
      onPress: () => router.push('/(tabs)/profile/medical-history'),
    },
    {
      icon: <Shield size={24} color={Colors.textSecondary} />,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy',
      onPress: () => router.push('/(tabs)/profile/privacy'),
    },
    {
      icon: <Settings size={24} color={Colors.textSecondary} />,
      title: 'Settings',
      subtitle: 'App preferences',
      onPress: () => router.push('/(tabs)/profile/settings'),
    },
    {
      icon: <HelpCircle size={24} color={Colors.textSecondary} />,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      onPress: () => router.push('/(tabs)/profile/help'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.patientId}>Patient ID: #HC-{user?.uid?.slice(-6)}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  {item.icon}
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    marginBottom: Spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  patientId: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textTertiary,
  },
  menuSection: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xxl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  menuItemSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xxl,
    ...Shadows.sm,
  },
  logoutText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.error,
    marginLeft: Spacing.sm,
  },
  versionText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
});