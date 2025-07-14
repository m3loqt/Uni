import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Download, RefreshCw, FileText } from 'lucide-react-native';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { useHealthStore } from '@/store/healthStore';
import { getCertificates } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

export default function CertificatesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const { certificates, setCertificates, loading, error, setLoading, setError } = useHealthStore();

  useEffect(() => {
    if (user) {
      loadCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    if (user) {
      setLoading('certificates', true);
      try {
        const data = await getCertificates(user.uid);
        setCertificates(data);
      } catch (error) {
        setError('certificates', error.message);
      } finally {
        setLoading('certificates', false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCertificates();
    setRefreshing(false);
  };

  const filteredCertificates = certificates.filter(certificate =>
    certificate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCertificatePress = (certificateId: string) => {
    router.push(`/(tabs)/certificates/${certificateId}`);
  };

  const handleDownloadAll = () => {
    // TODO: Implement download all certificates functionality
    console.log('Download all certificates');
  };

  if (loading.certificates) {
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Medical Cert</Text>
          <Text style={styles.headerSubtitle}>
            {filteredCertificates.length} {filteredCertificates.length === 1 ? 'certificate' : 'certificates'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleRefresh} 
            disabled={refreshing}
          >
            <RefreshCw size={24} color={refreshing ? Colors.textTertiary : Colors.primary} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton} onPress={handleDownloadAll}>
            <Download size={24} color={Colors.textSecondary} />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search certificates..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Error State */}
      {error.certificates && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.certificates}</Text>
        </View>
      )}

      {/* Certificates List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.certificatesList}>
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                {...certificate}
                onPress={() => handleCertificatePress(certificate.id)}
                onDownload={() => {}}
              />
            ))
          ) : (
            <EmptyState
              icon={<FileText size={48} color={Colors.textTertiary} />}
              title="No certificates found"
              description={
                searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Medical certificates issued by your doctors will appear here. Visit a doctor to request certificates when needed."
              }
              actionText="Book Appointment"
              onAction={() => router.push('/(tabs)/appointments/book')}
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
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
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  certificatesList: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorContainer: {
    margin: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
  },
});