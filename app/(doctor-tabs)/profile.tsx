import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Settings, User, FileText, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Camera, CreditCard as Edit, Stethoscope, Award, Clock } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

export default function DoctorProfileScreen() {
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
      title: 'Professional Information',
      subtitle: 'Update your medical credentials',
      onPress: () => {},
    },
    {
      icon: <Stethoscope size={24} color={Colors.textSecondary} />,
      title: 'Practice Settings',
      subtitle: 'Manage clinic and availability',
      onPress: () => {},
    },
    {
      icon: <Award size={24} color={Colors.textSecondary} />,
      title: 'Certifications',
      subtitle: 'View and update credentials',
      onPress: () => {},
    },
    {
      icon: <Clock size={24} color={Colors.textSecondary} />,
      title: 'Schedule Management',
      subtitle: 'Set availability and breaks',
      onPress: () => {},
    },
    {
      icon: <FileText size={24} color={Colors.textSecondary} />,
      title: 'Medical Records',
      subtitle: 'Access patient records',
      onPress: () => {},
    },
    {
      icon: <Shield size={24} color={Colors.textSecondary} />,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onPress: () => {},
    },
    {
      icon: <Settings size={24} color={Colors.textSecondary} />,
      title: 'App Settings',
      subtitle: 'Notifications and preferences',
      onPress: () => {},
    },
    {
      icon: <HelpCircle size={24} color={Colors.textSecondary} />,
      title: 'Help & Support',
      subtitle: 'Get assistance and resources',
      onPress: () => {},
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
              source={{ uri: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Dr. {user?.displayName || 'Doctor'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.professionalInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Specialty</Text>
              <Text style={styles.infoValue}>Cardiologist</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>License</Text>
              <Text style={styles.infoValue}>MD-{user?.uid?.slice(-6)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>15 years</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>89</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
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
        <Text style={styles.versionText}>HealthConnect Doctor v1.0.0</Text>
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
    paddingVertical: Spacing.xxxxl,
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
    marginBottom: Spacing.lg,
  },
  professionalInfo: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Medium',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  statsSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  statsTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.gray50,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
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
    marginBottom: Spacing.xxxxl,
  },
});