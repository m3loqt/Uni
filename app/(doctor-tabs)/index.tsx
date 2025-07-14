import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Calendar, Users, FileText, Activity, Plus, Clock } from 'lucide-react-native';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { getDoctorAppointments, getDoctorPatients } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

export default function DoctorDashboardScreen() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (user) {
      try {
        const [appointmentsData, patientsData] = await Promise.all([
          getDoctorAppointments(user.uid),
          getDoctorPatients(user.uid)
        ]);
        
        setAppointments(appointmentsData);
        setPatients(patientsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today && apt.status === 'upcoming';
  });

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const completedToday = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today && apt.status === 'completed';
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Dr. {user?.displayName || 'Doctor'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.statsContainer}
            contentContainerStyle={styles.statsContent}
          >
            <StatCard
              title="Today's Appointments"
              value={todayAppointments.length.toString()}
              unit="appointments"
              icon={<Calendar size={24} color="#fff" />}
              gradient={[Colors.primary, Colors.primaryLight]}
            />
            <StatCard
              title="Total Patients"
              value={patients.length.toString()}
              unit="patients"
              icon={<Users size={24} color="#fff" />}
              gradient={[Colors.secondary, '#059669']}
            />
            <StatCard
              title="Completed Today"
              value={completedToday.length.toString()}
              unit="consultations"
              icon={<Activity size={24} color="#fff" />}
              gradient={[Colors.accent, '#D97706']}
            />
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="View Patients"
              subtitle="Manage patient records"
              icon={<Users size={24} color={Colors.primary} />}
              onPress={() => router.push('/(doctor-tabs)/patients')}
            />
            <QuickActionCard
              title="Appointments"
              subtitle="Today's schedule"
              icon={<Calendar size={24} color={Colors.primary} />}
              onPress={() => router.push('/(doctor-tabs)/appointments')}
            />
            <QuickActionCard
              title="Prescriptions"
              subtitle="Manage medications"
              icon={<FileText size={24} color={Colors.primary} />}
              onPress={() => router.push('/(doctor-tabs)/prescriptions')}
            />
            <QuickActionCard
              title="Add Patient"
              subtitle="Register new patient"
              icon={<Plus size={24} color={Colors.primary} />}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity onPress={() => router.push('/(doctor-tabs)/appointments')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {todayAppointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {todayAppointments.slice(0, 3).map((appointment) => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <View style={styles.appointmentTime}>
                    <Clock size={16} color={Colors.primary} />
                    <Text style={styles.timeText}>{appointment.time}</Text>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.patientName}>{appointment.patientName}</Text>
                    <Text style={styles.appointmentType}>{appointment.specialty}</Text>
                  </View>
                  <TouchableOpacity style={styles.appointmentAction}>
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<Calendar size={48} color={Colors.textTertiary} />}
              title="No appointments today"
              description="You have a free day! Use this time to catch up on patient records or take a well-deserved break."
            />
          )}
        </View>

        {/* Recent Patients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Patients</Text>
            <TouchableOpacity onPress={() => router.push('/(doctor-tabs)/patients')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {patients.length > 0 ? (
            <View style={styles.patientsList}>
              {patients.slice(0, 3).map((patient) => (
                <View key={patient.id} style={styles.patientItem}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.avatarText}>
                      {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                    </Text>
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientInfo}>Last visit: {patient.lastVisit || 'No recent visits'}</Text>
                  </View>
                  <TouchableOpacity style={styles.patientAction}>
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<Users size={48} color={Colors.textTertiary} />}
              title="No patients yet"
              description="Start building your patient base by scheduling appointments and consultations."
            />
          )}
        </View>
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
  greeting: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  statsContainer: {
    marginHorizontal: -Spacing.xl,
  },
  statsContent: {
    paddingHorizontal: Spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  appointmentsList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    width: 80,
  },
  timeText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  patientName: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  appointmentType: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  appointmentAction: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.surface,
  },
  patientsList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-Bold',
    color: Colors.surface,
  },
  patientDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  patientInfo: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  patientAction: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
  },
});