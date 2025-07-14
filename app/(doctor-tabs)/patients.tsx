import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Search, Plus, Users, Phone, Mail } from 'lucide-react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { getDoctorPatients } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

export default function DoctorPatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user]);

  const loadPatients = async () => {
    if (user) {
      try {
        const data = await getDoctorPatients(user.uid);
        setPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    // TODO: Implement add patient functionality
    console.log('Add new patient');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Patients</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddPatient}>
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Patients Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredPatients.length} {filteredPatients.length === 1 ? 'Patient' : 'Patients'}
        </Text>
      </View>

      {/* Patients List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={styles.patientCard}
                onPress={() => {}}
              >
                <View style={styles.patientHeader}>
                  <View style={styles.patientAvatar}>
                    {patient.imageUrl ? (
                      <Image source={{ uri: patient.imageUrl }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarText}>
                        {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                      </Text>
                    )}
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientEmail}>{patient.email}</Text>
                  </View>
                  <View style={styles.patientStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>

                <View style={styles.patientDetails}>
                  {patient.phone && (
                    <View style={styles.detailRow}>
                      <Phone size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{patient.phone}</Text>
                    </View>
                  )}
                  {patient.dateOfBirth && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Age:</Text>
                      <Text style={styles.detailText}>
                        {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                      </Text>
                    </View>
                  )}
                  {patient.bloodType && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Blood Type:</Text>
                      <Text style={styles.detailText}>{patient.bloodType}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.patientActions}>
                  <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonText}>View Records</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButtonPrimary}>
                    <Text style={styles.actionButtonTextPrimary}>Schedule</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              icon={<Users size={48} color={Colors.textTertiary} />}
              title="No patients found"
              description={
                searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Start building your patient base by scheduling appointments and consultations."
              }
              actionText="Add Patient"
              onAction={handleAddPatient}
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  countContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  countText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  patientsList: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  patientCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
  },
  avatarText: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-Bold',
    color: Colors.surface,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  patientEmail: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  patientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Medium',
    color: Colors.success,
  },
  patientDetails: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    minWidth: 80,
  },
  detailText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
  },
  patientActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButtonSecondary: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  actionButtonTextPrimary: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.surface,
  },
});