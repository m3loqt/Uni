import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Calendar, FileText, Activity, Heart, QrCode } from 'lucide-react-native';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { PrescriptionCard } from '@/components/dashboard/PrescriptionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { useHealthStore } from '@/store/healthStore';
import { useResponsive } from '@/hooks/useResponsive';
import { subscribeToHealthData, subscribeToAppointments, getPrescriptions } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

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
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Health Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          {error.healthData ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error.healthData}</Text>
            </View>
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
                gradient={['#EF4444', '#DC2626']}
              />
              <StatCard
                title="Steps Today"
                value={healthData.steps?.toLocaleString() || '8,432'}
                unit="steps"
                icon={<Activity size={24} color="#fff" />}
                gradient={['#10B981', '#059669']}
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

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionCard
              title="Medical History"
              subtitle="View complete medical records"
              icon={<FileText size={24} color={Colors.primary} />}
              onPress={handleMedicalHistory}
              variant="full"
            />
            <QuickActionCard
              title="Generate QR Code"
              subtitle="Share your health profile"
              icon={<QrCode size={24} color={Colors.primary} />}
              onPress={handleGenerateQR}
              variant="full"
            />
          </View>
        </View>

        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={handleViewAppointments}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.contentCard}>
            {error.appointments ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error.appointments}</Text>
              </View>
            ) : upcomingAppointment ? (
              <AppointmentCard
                doctorName={upcomingAppointment.doctorName}
                specialty={upcomingAppointment.specialty}
                date={upcomingAppointment.date}
                time={upcomingAppointment.time}
                imageUrl={upcomingAppointment.imageUrl}
              />
            ) : (
              <EmptyState
                icon={<Calendar size={40} color={Colors.textTertiary} />}
                title="No upcoming appointments"
                description="Schedule your next appointment to stay on top of your health"
                actionText="Book Appointment"
                onAction={handleBookAppointment}
                variant="compact"
              />
            )}
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
              <View style={styles.emptyStateContainer}>
                <EmptyState
                  icon={<FileText size={40} color={Colors.textTertiary} />}
                  title="No active prescriptions"
                  description="Your prescriptions from doctors will appear here"
                  actionText="Book Appointment"
                  onAction={handleBookAppointment}
                  variant="compact"
                />
              </View>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  quickActionsTitle: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
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
  quickActionsContainer: {
    gap: Spacing.lg,
  },
  contentCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  prescriptionsContainer: {
    // No background or shadow - let individual cards handle their own styling
  },
  prescriptionsContent: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs, // Small padding to prevent cards from touching edges
  },
  emptyStateContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  errorContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: Spacing.xxxxl,
  },
});