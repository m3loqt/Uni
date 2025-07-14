import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Calendar, FileText, Activity, Heart, QrCode, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { PrescriptionCard } from '@/components/dashboard/PrescriptionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { useHealthStore } from '@/store/healthStore';
import { useResponsive } from '@/hooks/useResponsive';
import { subscribeToHealthData, subscribeToAppointments, getPrescriptions } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows, Typography } from '@/constants/theme';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { 
    healthData, 
    appointments, 
    prescriptions,
    setHealthData, 
    setAppointments,
    setPrescriptions,
    loading, 
    error,
    setLoading,
    setError 
  } = useHealthStore();
  const { isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    if (user) {
      setLoading('healthData', true);
      setLoading('appointments', true);
      setLoading('prescriptions', true);

      // Subscribe to real-time health data
      const unsubscribeHealth = subscribeToHealthData(user.uid, (data) => {
        if (data) {
          setHealthData(data);
        }
        setLoading('healthData', false);
      });

      // Subscribe to real-time appointments
      const unsubscribeAppointments = subscribeToAppointments(user.uid, (data) => {
        setAppointments(data);
        setLoading('appointments', false);
      });

      // Load prescriptions
      const loadPrescriptions = async () => {
        try {
          const prescriptionsData = await getPrescriptions(user.uid);
          setPrescriptions(prescriptionsData);
        } catch (error) {
          setError('prescriptions', error.message);
        } finally {
          setLoading('prescriptions', false);
        }
      };

      loadPrescriptions();

      return () => {
        unsubscribeHealth();
        unsubscribeAppointments();
      };
    }
  }, [user]);

  const upcomingAppointment = appointments.find(apt => apt.status === 'upcoming');
  const activePrescriptions = prescriptions.filter(p => p.status === 'active');
  const isLoading = loading.healthData || loading.appointments;

  const handleBookAppointment = () => {
    router.push('/(tabs)/appointments/book');
  };

  const handleViewPrescriptions = () => {
    router.push('/(tabs)/prescriptions');
  };

  const handleViewAppointments = () => {
    router.push('/(tabs)/appointments');
  };

  const handleViewAllPrescriptions = () => {
    router.push('/(tabs)/prescriptions');
  };

  const handleMedicalHistory = () => {
    router.push('/(tabs)/profile/medical-history');
  };

  const handleGenerateQR = () => {
    router.push('/qr-code');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
            </View>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color={Colors.textSecondary} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarButton}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Appointment Card */}
        {upcomingAppointment && (
          <Card variant="elevated" style={styles.appointmentCard}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.appointmentGradient}
            >
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentLabel}>Appointment today</Text>
                <Calendar size={20} color={Colors.textInverse} />
              </View>
              <AppointmentCard
                doctorName={upcomingAppointment.doctorName}
                specialty={upcomingAppointment.specialty}
                date={upcomingAppointment.date}
                time={upcomingAppointment.time}
                imageUrl={upcomingAppointment.imageUrl}
              />
            </LinearGradient>
          </Card>
        )}

        {/* Health Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          {error.healthData ? (
            <Card variant="outlined" style={styles.errorCard}>
              <Text style={styles.errorText}>{error.healthData}</Text>
            </Card>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.statsContainer}
              contentContainerStyle={styles.statsContent}
            >
              <StatCard
                title="Heart Rate"
                value={healthData.heartRate?.toString() || '72'}
                unit="bpm"
                icon={<Heart size={24} color="#fff" />}
                gradient={[Colors.error, '#DC2626']}
              />
              <StatCard
                title="Steps Today"
                value={healthData.steps?.toLocaleString() || '8,432'}
                unit="steps"
                icon={<Activity size={24} color="#fff" />}
                gradient={[Colors.success, '#059669']}
              />
              <StatCard
                title="Sleep"
                value={healthData.sleep?.toString() || '7.5'}
                unit="hours"
                icon={<Activity size={24} color="#fff" />}
                gradient={['#8B5CF6', '#7C3AED']}
              />
            </ScrollView>
          )}
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            <QuickActionCard
              title="Medical History"
              subtitle="View complete records"
              icon={<FileText size={24} color={Colors.primary} />}
              onPress={handleMedicalHistory}
              variant="service"
            />
            <QuickActionCard
              title="Generate QR"
              subtitle="Share health profile"
              icon={<QrCode size={24} color={Colors.primary} />}
              onPress={handleGenerateQR}
              variant="service"
            />
            <QuickActionCard
              title="Book Visit"
              subtitle="Schedule appointment"
              icon={<Plus size={24} color={Colors.primary} />}
              onPress={handleBookAppointment}
              variant="service"
            />
            <QuickActionCard
              title="Prescriptions"
              subtitle="Manage medications"
              icon={<FileText size={24} color={Colors.primary} />}
              onPress={handleViewPrescriptions}
              variant="service"
            />
          </View>
        </View>

        {/* Active Prescriptions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Prescriptions</Text>
            <TouchableOpacity onPress={handleViewAllPrescriptions}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.prescriptionsContainer}>
            {activePrescriptions.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.prescriptionsContent}
              >
                {activePrescriptions.slice(0, 3).map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    medicineName={prescription.medicineName}
                    dosage={prescription.dosage}
                    doctorName={prescription.doctorName}
                    daysLeft={prescription.daysLeft}
                  />
                ))}
              </ScrollView>
            ) : (
              <Card variant="outlined">
                <EmptyState
                  icon={<FileText size={40} color={Colors.textTertiary} />}
                  title="No active prescriptions"
                  description="Your prescriptions from doctors will appear here"
                  actionText="Book Appointment"
                  onAction={handleBookAppointment}
                  variant="compact"
                />
              </Card>
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  scrollContent: {
    paddingBottom: Spacing.xxxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  greetingContainer: {
    marginBottom: Spacing.sm,
  },
  greeting: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.h1.fontSize,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.h4.fontSize,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textInverse,
  },
  appointmentCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
    padding: 0,
    overflow: 'hidden',
  },
  appointmentGradient: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appointmentLabel: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textInverse,
  },
  section: {
    marginBottom: Spacing.xxxxl,
    paddingHorizontal: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: Typography.caption.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  statsContainer: {
    marginHorizontal: -Spacing.xl,
  },
  statsContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  prescriptionsContainer: {
    // No background or shadow - let individual cards handle their own styling
  },
  prescriptionsContent: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs, // Small padding to prevent cards from touching edges
  },
  errorCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: Spacing.xxxxl,
  },
});