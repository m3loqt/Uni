import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Heart, Pill, Activity, TriangleAlert as AlertTriangle, Calendar, User } from 'lucide-react-native';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface MedicalRecord {
  id: string;
  type: 'allergy' | 'condition' | 'surgery' | 'medication' | 'visit';
  title: string;
  description: string;
  date: string;
  doctor?: string;
  severity?: 'low' | 'medium' | 'high';
}

const mockMedicalHistory: MedicalRecord[] = [
  {
    id: '1',
    type: 'allergy',
    title: 'Penicillin Allergy',
    description: 'Severe allergic reaction to penicillin-based antibiotics',
    date: '2020-03-15',
    severity: 'high',
  },
  {
    id: '2',
    type: 'condition',
    title: 'Hypertension',
    description: 'High blood pressure, currently managed with medication',
    date: '2022-01-10',
    doctor: 'Dr. Emily Rodriguez',
    severity: 'medium',
  },
  {
    id: '3',
    type: 'surgery',
    title: 'Appendectomy',
    description: 'Laparoscopic appendix removal surgery',
    date: '2015-08-22',
    doctor: 'Dr. Michael Thompson',
  },
  {
    id: '4',
    type: 'medication',
    title: 'Lisinopril',
    description: 'ACE inhibitor for blood pressure management - 10mg daily',
    date: '2022-01-15',
    doctor: 'Dr. Emily Rodriguez',
  },
  {
    id: '5',
    type: 'visit',
    title: 'Annual Physical Exam',
    description: 'Routine health checkup with blood work and vitals',
    date: '2024-01-15',
    doctor: 'Dr. Emily Rodriguez',
  },
  {
    id: '6',
    type: 'allergy',
    title: 'Shellfish Allergy',
    description: 'Mild allergic reaction to shellfish and crustaceans',
    date: '2018-06-10',
    severity: 'low',
  },
];

export default function MedicalHistoryScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    // Simulate loading medical history
    const loadMedicalHistory = async () => {
      setLoading(true);
      // In a real app, this would fetch from Firebase
      setTimeout(() => {
        setMedicalHistory(mockMedicalHistory);
        setLoading(false);
      }, 1000);
    };

    loadMedicalHistory();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'allergy':
        return <AlertTriangle size={20} color={Colors.warning} />;
      case 'condition':
        return <Heart size={20} color={Colors.error} />;
      case 'surgery':
        return <Activity size={20} color={Colors.primary} />;
      case 'medication':
        return <Pill size={20} color={Colors.success} />;
      case 'visit':
        return <Calendar size={20} color={Colors.textSecondary} />;
      default:
        return <User size={20} color={Colors.textSecondary} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'allergy':
        return Colors.warning;
      case 'condition':
        return Colors.error;
      case 'surgery':
        return Colors.primary;
      case 'medication':
        return Colors.success;
      case 'visit':
        return Colors.textSecondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Patient Info */}
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{user?.displayName || 'Patient'}</Text>
        <Text style={styles.patientId}>Patient ID: #HC-{user?.uid?.slice(-6)}</Text>
      </View>

      {/* Medical Records */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.recordsList}>
          {medicalHistory.map((record) => (
            <TouchableOpacity key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={[styles.typeIconContainer, { backgroundColor: `${getTypeColor(record.type)}15` }]}>
                  {getTypeIcon(record.type)}
                </View>
                <View style={styles.recordInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.recordTitle}>{record.title}</Text>
                    {record.severity && (
                      <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(record.severity) }]}>
                        <Text style={styles.severityText}>{record.severity}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.recordType}>{record.type.charAt(0).toUpperCase() + record.type.slice(1)}</Text>
                </View>
              </View>

              <Text style={styles.recordDescription}>{record.description}</Text>

              <View style={styles.recordFooter}>
                <View style={styles.dateContainer}>
                  <Calendar size={14} color={Colors.textSecondary} />
                  <Text style={styles.dateText}>{formatDate(record.date)}</Text>
                </View>
                {record.doctor && (
                  <View style={styles.doctorContainer}>
                    <User size={14} color={Colors.textSecondary} />
                    <Text style={styles.doctorText}>{record.doctor}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 44,
  },
  patientInfo: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  patientName: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  patientId: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  recordsList: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  recordCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recordInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  recordTitle: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  severityText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.surface,
    textTransform: 'uppercase',
  },
  recordType: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  recordDescription: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  doctorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  doctorText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});