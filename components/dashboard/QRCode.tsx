import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Download, Share2, Copy, QrCode } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

export default function QRCodeScreen() {
  const { user } = useAuthStore();
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    // Generate QR code data with patient information
    if (user) {
      const patientData = {
        id: `HC-${user.uid?.slice(-6)}`,
        name: user.displayName || 'Patient',
        email: user.email,
        emergencyContact: '+1234567890',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Shellfish'],
        conditions: ['Hypertension'],
        lastUpdated: new Date().toISOString(),
      };
      
      setQrData(JSON.stringify(patientData));
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `HealthConnect Patient Profile\nPatient ID: HC-${user?.uid?.slice(-6)}\nName: ${user?.displayName || 'Patient'}\n\nScan QR code for full medical profile.`,
        title: 'HealthConnect Patient Profile',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handleCopyData = () => {
    // In a real app, you would copy to clipboard
    Alert.alert('Copied', 'Patient data copied to clipboard');
  };

  const handleDownload = () => {
    // In a real app, you would save the QR code image
    Alert.alert('Downloaded', 'QR code saved to gallery');
  };

  // Simple QR code representation using text (in a real app, use a QR code library)
  const renderQRCode = () => {
    return (
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCodePlaceholder}>
          <QrCode size={120} color={Colors.textPrimary} />
          <Text style={styles.qrCodeText}>QR Code</Text>
          <Text style={styles.qrCodeSubtext}>Scan to view patient profile</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Patient Info */}
        <View style={styles.patientCard}>
          <Text style={styles.patientName}>{user?.displayName || 'Patient'}</Text>
          <Text style={styles.patientId}>Patient ID: #HC-{user?.uid?.slice(-6)}</Text>
          <Text style={styles.patientEmail}>{user?.email}</Text>
        </View>

        {/* QR Code */}
        {renderQRCode()}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to use this QR Code</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>• Healthcare providers can scan this code to access your medical records</Text>
            <Text style={styles.instructionItem}>• Emergency responders can quickly view your allergies and conditions</Text>
            <Text style={styles.instructionItem}>• Share with trusted family members for emergency situations</Text>
            {/* <Text style={styles.instructionItem}>• Keep a screenshot on your phone for offline access</Text> */}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            <Download size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
           
          {/* <TouchableOpacity style={styles.actionButton} onPress={handleCopyData}>
            <Copy size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Copy Data</Text>
          </TouchableOpacity> */}
        </View>

        {/* Security Notice */}
        {/* <View style={styles.securityNotice}>
          <Text style={styles.securityTitle}>🔒 Privacy & Security</Text>
          <Text style={styles.securityText}>
            This QR code contains basic medical information only. Sensitive data is protected and requires proper authentication to access.
          </Text>
        </View> */}

        {/* Additional spacing at bottom for better scroll experience */}
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
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxxl, // Extra padding at bottom
  },
  patientCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.md,
  },
  patientName: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  patientId: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  patientEmail: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  qrCodePlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    ...Shadows.md,
  },
  qrCodeText: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  qrCodeSubtext: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  instructionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  instructionsTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  instructionsList: {
    gap: Spacing.sm,
  },
  instructionItem: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  securityNotice: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    marginBottom: Spacing.xl,
  },
  securityTitle: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  securityText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});