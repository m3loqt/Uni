import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone, 
  Volume2, 
  Eye, 
  Download, 
  Trash2,
  RefreshCw,
  Save,
  ChevronRight
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { useResponsive } from '@/hooks/useResponsive';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface SettingsState {
  // Notifications
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  medicationReminders: boolean;
  healthAlerts: boolean;
  
  // Appearance
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  
  // Privacy & Security
  biometricAuth: boolean;
  autoLock: boolean;
  autoLockTime: '1min' | '5min' | '15min' | '30min';
  shareHealthData: boolean;
  
  // Data & Storage
  autoSync: boolean;
  wifiOnlySync: boolean;
  cacheSize: string;
  
  // Accessibility
  highContrast: boolean;
  reduceMotion: boolean;
  voiceOver: boolean;
  
  // Advanced
  developerMode: boolean;
  crashReporting: boolean;
  analytics: boolean;
}

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
];

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const autoLockOptions = [
  { value: '1min', label: '1 minute' },
  { value: '5min', label: '5 minutes' },
  { value: '15min', label: '15 minutes' },
  { value: '30min', label: '30 minutes' },
];

export default function SettingsScreen() {
  const { user } = useAuthStore();
  const { isTablet, isDesktop } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    healthAlerts: true,
    
    // Appearance
    darkMode: false,
    fontSize: 'medium',
    language: 'en',
    
    // Privacy & Security
    biometricAuth: true,
    autoLock: true,
    autoLockTime: '5min',
    shareHealthData: false,
    
    // Data & Storage
    autoSync: true,
    wifiOnlySync: true,
    cacheSize: '2.3 MB',
    
    // Accessibility
    highContrast: false,
    reduceMotion: false,
    voiceOver: false,
    
    // Advanced
    developerMode: false,
    crashReporting: true,
    analytics: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Simulate loading from AsyncStorage/Firebase
      setTimeout(() => {
        // In real implementation, load from storage
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (hasChanges) {
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

  const handleSettingChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving to AsyncStorage/Firebase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', 'Settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              pushNotifications: true,
              emailNotifications: true,
              smsNotifications: false,
              appointmentReminders: true,
              medicationReminders: true,
              healthAlerts: true,
              darkMode: false,
              fontSize: 'medium',
              language: 'en',
              biometricAuth: false,
              autoLock: true,
              autoLockTime: '5min',
              shareHealthData: false,
              autoSync: true,
              wifiOnlySync: true,
              cacheSize: '0 MB',
              highContrast: false,
              reduceMotion: false,
              voiceOver: false,
              developerMode: false,
              crashReporting: true,
              analytics: true,
            });
            setHasChanges(true);
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. The app may take longer to load initially.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            handleSettingChange('cacheSize', '0 MB');
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const showDropdownSelection = (
    title: string,
    options: { value: string; label: string }[],
    currentValue: string,
    onSelect: (value: string) => void
  ) => {
    Alert.alert(
      title,
      '',
      options.map(option => ({
        text: option.label,
        onPress: () => onSelect(option.value),
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const renderSwitchSetting = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.gray200, true: `${Colors.primary}40` }}
        thumbColor={value ? Colors.primary : Colors.gray400}
      />
    </View>
  );

  const renderDropdownSetting = (
    title: string,
    subtitle: string,
    value: string,
    options: { value: string; label: string }[],
    onSelect: (value: string) => void,
    icon: React.ReactNode
  ) => {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => showDropdownSelection(title, options, value, onSelect)}
      >
        <View style={styles.settingIcon}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.dropdownValue}>
          <Text style={styles.dropdownText}>{selectedOption?.label}</Text>
          <ChevronRight size={16} color={Colors.textTertiary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderActionSetting = (
    title: string,
    subtitle: string,
    onPress: () => void,
    icon: React.ReactNode,
    destructive = false
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={16} color={Colors.textTertiary} />
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetSettings}
          >
            <RefreshCw size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={containerStyle}>
            {/* Notifications Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              
              {renderSwitchSetting(
                'Push Notifications',
                'Receive notifications on your device',
                settings.pushNotifications,
                (value) => handleSettingChange('pushNotifications', value),
                <Bell size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'Email Notifications',
                'Receive notifications via email',
                settings.emailNotifications,
                (value) => handleSettingChange('emailNotifications', value),
                <Bell size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'SMS Notifications',
                'Receive notifications via text message',
                settings.smsNotifications,
                (value) => handleSettingChange('smsNotifications', value),
                <Smartphone size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'Appointment Reminders',
                'Get reminded about upcoming appointments',
                settings.appointmentReminders,
                (value) => handleSettingChange('appointmentReminders', value),
                <Bell size={20} color={Colors.success} />
              )}

              {renderSwitchSetting(
                'Medication Reminders',
                'Get reminded to take your medications',
                settings.medicationReminders,
                (value) => handleSettingChange('medicationReminders', value),
                <Bell size={20} color={Colors.warning} />
              )}

              {renderSwitchSetting(
                'Health Alerts',
                'Receive important health notifications',
                settings.healthAlerts,
                (value) => handleSettingChange('healthAlerts', value),
                <Bell size={20} color={Colors.error} />
              )}
            </View>

            {/* Appearance Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Appearance</Text>
              
              {renderSwitchSetting(
                'Dark Mode',
                'Use dark theme throughout the app',
                settings.darkMode,
                (value) => handleSettingChange('darkMode', value),
                <Moon size={20} color={Colors.primary} />
              )}

              {renderDropdownSetting(
                'Font Size',
                'Adjust text size for better readability',
                settings.fontSize,
                fontSizeOptions,
                (value) => handleSettingChange('fontSize', value),
                <Eye size={20} color={Colors.primary} />
              )}

              {renderDropdownSetting(
                'Language',
                'Choose your preferred language',
                settings.language,
                languageOptions,
                (value) => handleSettingChange('language', value),
                <Globe size={20} color={Colors.primary} />
              )}
            </View>

            {/* Privacy & Security Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy & Security</Text>
              
              {renderSwitchSetting(
                'Biometric Authentication',
                'Use fingerprint or face ID to unlock',
                settings.biometricAuth,
                (value) => handleSettingChange('biometricAuth', value),
                <Shield size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'Auto Lock',
                'Automatically lock the app when inactive',
                settings.autoLock,
                (value) => handleSettingChange('autoLock', value),
                <Shield size={20} color={Colors.primary} />
              )}

              {settings.autoLock && renderDropdownSetting(
                'Auto Lock Time',
                'Time before app automatically locks',
                settings.autoLockTime,
                autoLockOptions,
                (value) => handleSettingChange('autoLockTime', value),
                <Shield size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'Share Health Data',
                'Allow sharing anonymized health data for research',
                settings.shareHealthData,
                (value) => handleSettingChange('shareHealthData', value),
                <Shield size={20} color={Colors.warning} />
              )}
            </View>

            {/* Data & Storage Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data & Storage</Text>
              
              {renderSwitchSetting(
                'Auto Sync',
                'Automatically sync data when connected',
                settings.autoSync,
                (value) => handleSettingChange('autoSync', value),
                <RefreshCw size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'WiFi Only Sync',
                'Only sync when connected to WiFi',
                settings.wifiOnlySync,
                (value) => handleSettingChange('wifiOnlySync', value),
                <Download size={20} color={Colors.primary} />
              )}

              {renderActionSetting(
                'Clear Cache',
                `Current cache size: ${settings.cacheSize}`,
                handleClearCache,
                <Trash2 size={20} color={Colors.warning} />
              )}
            </View>

            {/* Accessibility Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accessibility</Text>
              
              {renderSwitchSetting(
                'High Contrast',
                'Increase contrast for better visibility',
                settings.highContrast,
                (value) => handleSettingChange('highContrast', value),
                <Eye size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'Reduce Motion',
                'Minimize animations and transitions',
                settings.reduceMotion,
                (value) => handleSettingChange('reduceMotion', value),
                <Eye size={20} color={Colors.primary} />
              )}

              {renderSwitchSetting(
                'VoiceOver Support',
                'Enhanced screen reader support',
                settings.voiceOver,
                (value) => handleSettingChange('voiceOver', value),
                <Volume2 size={20} color={Colors.primary} />
              )}
            </View>

            {/* Advanced Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Advanced</Text>
              
              {renderSwitchSetting(
                'Developer Mode',
                'Enable advanced debugging features',
                settings.developerMode,
                (value) => handleSettingChange('developerMode', value),
                <Smartphone size={20} color={Colors.warning} />
              )}

              {renderSwitchSetting(
                'Crash Reporting',
                'Help improve the app by sending crash reports',
                settings.crashReporting,
                (value) => handleSettingChange('crashReporting', value),
                <Shield size={20} color={Colors.success} />
              )}

              {renderSwitchSetting(
                'Analytics',
                'Help improve the app with usage analytics',
                settings.analytics,
                (value) => handleSettingChange('analytics', value),
                <Shield size={20} color={Colors.success} />
              )}
            </View>

            {/* Save Button */}
            {hasChanges && (
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
  resetButton: {
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
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  dropdownValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dropdownText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  destructiveText: {
    color: Colors.error,
  },
  saveSection: {
    marginTop: Spacing.xl,
  },
  bottomSpacing: {
    height: Spacing.xxxxl,
  },
});