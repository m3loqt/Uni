import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Camera, Save, User, Mail, Phone, Calendar, MapPin, Heart, Droplet, TriangleAlert as AlertTriangle, Users, CreditCard as Edit3 } from 'lucide-react-native';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { useResponsive } from '@/hooks/useResponsive';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  allergies: string;
  chronicConditions: string;
  imageUrl: string;
}

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const relationshipOptions = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'];

export default function PersonalInformationScreen() {
  const { user } = useAuthStore();
  const { isTablet, isDesktop } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    allergies: '',
    chronicConditions: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadPersonalInfo();
  }, [user]);

  const loadPersonalInfo = async () => {
    setLoading(true);
    try {
      // Simulate loading from Firebase
      // In real implementation, fetch from Firebase using user.uid
      setTimeout(() => {
        setPersonalInfo({
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1990-05-15',
          gender: 'Male',
          bloodType: 'O+',
          height: '175',
          weight: '70',
          address: '123 Main Street, City, State 12345',
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '+1 (555) 987-6543',
          emergencyContactRelationship: 'Spouse',
          allergies: 'Penicillin, Shellfish',
          chronicConditions: 'Hypertension',
          imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading personal info:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isEditing) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate required fields
      if (!personalInfo.name.trim()) {
        Alert.alert('Validation Error', 'Name is required');
        setSaving(false);
        return;
      }

      if (!personalInfo.email.trim()) {
        Alert.alert('Validation Error', 'Email is required');
        setSaving(false);
        return;
      }

      // Simulate saving to Firebase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', 'Personal information updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
    if (!isEditing) setIsEditing(true);
  };

  const handlePhotoChange = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    field: keyof PersonalInfo,
    icon: React.ReactNode
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => {
          Alert.alert(
            `Select ${label}`,
            '',
            options.map(option => ({
              text: option,
              onPress: () => handleFieldChange(field, option),
            })).concat([{ text: 'Cancel', style: 'cancel' }])
          );
        }}
      >
        <View style={styles.dropdownContent}>
          <View style={styles.dropdownIcon}>{icon}</View>
          <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
            {value || `Select ${label.toLowerCase()}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const containerStyle = isDesktop ? styles.desktopContainer : styles.mobileContainer;
  const contentStyle = isDesktop ? styles.desktopContent : styles.mobileContent;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Information</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={containerStyle}>
            {/* Profile Photo Section */}
            <View style={styles.photoSection}>
              <View style={styles.photoContainer}>
                <Image 
                  source={{ uri: personalInfo.imageUrl }} 
                  style={styles.profilePhoto}
                />
                <TouchableOpacity 
                  style={styles.photoButton}
                  onPress={handlePhotoChange}
                >
                  <Camera size={16} color={Colors.surface} />
                </TouchableOpacity>
              </View>
              <Text style={styles.photoLabel}>Profile Photo</Text>
            </View>

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <TextInput
                placeholder="Full Name"
                value={personalInfo.name}
                onChangeText={(value) => handleFieldChange('name', value)}
                icon={<User size={20} color={Colors.textSecondary} />}
                editable={isEditing}
                style={!isEditing && styles.readOnlyField}
              />

              <TextInput
                placeholder="Email Address"
                value={personalInfo.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                icon={<Mail size={20} color={Colors.textSecondary} />}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
                style={!isEditing && styles.readOnlyField}
              />

              <TextInput
                placeholder="Phone Number"
                value={personalInfo.phone}
                onChangeText={(value) => handleFieldChange('phone', value)}
                icon={<Phone size={20} color={Colors.textSecondary} />}
                keyboardType="phone-pad"
                editable={isEditing}
                style={!isEditing && styles.readOnlyField}
              />

              <TextInput
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={personalInfo.dateOfBirth}
                onChangeText={(value) => handleFieldChange('dateOfBirth', value)}
                icon={<Calendar size={20} color={Colors.textSecondary} />}
                editable={isEditing}
                style={!isEditing && styles.readOnlyField}
              />

              {isEditing ? (
                <>
                  {renderDropdown('Gender', personalInfo.gender, genderOptions, 'gender', 
                    <User size={20} color={Colors.textSecondary} />)}
                  {renderDropdown('Blood Type', personalInfo.bloodType, bloodTypeOptions, 'bloodType', 
                    <Droplet size={20} color={Colors.textSecondary} />)}
                </>
              ) : (
                <>
                  <View style={styles.readOnlyContainer}>
                    <User size={20} color={Colors.textSecondary} />
                    <View style={styles.readOnlyContent}>
                      <Text style={styles.readOnlyLabel}>Gender</Text>
                      <Text style={styles.readOnlyValue}>{personalInfo.gender || 'Not specified'}</Text>
                    </View>
                  </View>
                  <View style={styles.readOnlyContainer}>
                    <Droplet size={20} color={Colors.textSecondary} />
                    <View style={styles.readOnlyContent}>
                      <Text style={styles.readOnlyLabel}>Blood Type</Text>
                      <Text style={styles.readOnlyValue}>{personalInfo.bloodType || 'Not specified'}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Physical Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Physical Information</Text>
              
              <View style={styles.row}>
                <View style={styles.halfField}>
                  <TextInput
                    placeholder="Height (cm)"
                    value={personalInfo.height}
                    onChangeText={(value) => handleFieldChange('height', value)}
                    keyboardType="numeric"
                    editable={isEditing}
                    style={!isEditing && styles.readOnlyField}
                  />
                </View>
                <View style={styles.halfField}>
                  <TextInput
                    placeholder="Weight (kg)"
                    value={personalInfo.weight}
                    onChangeText={(value) => handleFieldChange('weight', value)}
                    keyboardType="numeric"
                    editable={isEditing}
                    style={!isEditing && styles.readOnlyField}
                  />
                </View>
              </View>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              
              <TextInput
                placeholder="Full Address"
                value={personalInfo.address}
                onChangeText={(value) => handleFieldChange('address', value)}
                icon={<MapPin size={20} color={Colors.textSecondary} />}
                multiline
                numberOfLines={3}
                editable={isEditing}
                style={[styles.textArea, !isEditing && styles.readOnlyField]}
              />
            </View>

            {/* Emergency Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              
              <TextInput
                placeholder="Contact Name"
                value={personalInfo.emergencyContactName}
                onChangeText={(value) => handleFieldChange('emergencyContactName', value)}
                icon={<Users size={20} color={Colors.textSecondary} />}
                editable={isEditing}
                style={!isEditing && styles.readOnlyField}
              />

              <TextInput
                placeholder="Contact Phone"
                value={personalInfo.emergencyContactPhone}
                onChangeText={(value) => handleFieldChange('emergencyContactPhone', value)}
                icon={<Phone size={20} color={Colors.textSecondary} />}
                keyboardType="phone-pad"
                editable={isEditing}
                style={!isEditing && styles.readOnlyField}
              />

              {isEditing ? (
                renderDropdown('Relationship', personalInfo.emergencyContactRelationship, relationshipOptions, 'emergencyContactRelationship', 
                  <Heart size={20} color={Colors.textSecondary} />)
              ) : (
                <View style={styles.readOnlyContainer}>
                  <Heart size={20} color={Colors.textSecondary} />
                  <View style={styles.readOnlyContent}>
                    <Text style={styles.readOnlyLabel}>Relationship</Text>
                    <Text style={styles.readOnlyValue}>{personalInfo.emergencyContactRelationship || 'Not specified'}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Medical Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medical Information</Text>
              
              <TextInput
                placeholder="Allergies (comma separated)"
                value={personalInfo.allergies}
                onChangeText={(value) => handleFieldChange('allergies', value)}
                icon={<AlertTriangle size={20} color={Colors.warning} />}
                multiline
                numberOfLines={2}
                editable={isEditing}
                style={[styles.textArea, !isEditing && styles.readOnlyField]}
              />

              <TextInput
                placeholder="Chronic Conditions (comma separated)"
                value={personalInfo.chronicConditions}
                onChangeText={(value) => handleFieldChange('chronicConditions', value)}
                icon={<Heart size={20} color={Colors.error} />}
                multiline
                numberOfLines={2}
                editable={isEditing}
                style={[styles.textArea, !isEditing && styles.readOnlyField]}
              />
            </View>

            {/* Save Button */}
            {isEditing && (
              <View style={styles.saveSection}>
                <Button
                  title={saving ? "Saving..." : "Save Changes"}
                  onPress={handleSave}
                  disabled={saving}
                />
              </View>
            )}

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
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
  editButton: {
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
    paddingBottom: Spacing.xxxxl,
  },
  mobileContainer: {
    padding: Spacing.xl,
  },
  mobileContent: {
    // Mobile-specific content styles
  },
  desktopContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    padding: Spacing.xxxxl,
    width: '100%',
  },
  desktopContent: {
    // Desktop-specific content styles
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxxl,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
  },
  photoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  photoLabel: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfField: {
    flex: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dropdownIcon: {
    marginRight: Spacing.md,
  },
  dropdownText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: Colors.textTertiary,
  },
  readOnlyField: {
    backgroundColor: Colors.gray50,
    color: Colors.textSecondary,
  },
  readOnlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  readOnlyContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  readOnlyLabel: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  readOnlyValue: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
  },
  saveSection: {
    marginTop: Spacing.xl,
  },
  bottomSpacing: {
    height: Spacing.xxxxl,
  },
});