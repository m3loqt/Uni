import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff, Heart, Stethoscope, UserCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { signUp } from '@/services/firebaseService';
import { UserRole } from '@/types';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName, selectedRole);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      id: 'patient' as UserRole,
      title: 'Patient',
      subtitle: 'Book appointments & manage health',
      icon: <User size={28} color={selectedRole === 'patient' ? Colors.surface : Colors.primary} />,
    },
    {
      id: 'doctor' as UserRole,
      title: 'Doctor',
      subtitle: 'Manage patients & appointments',
      icon: <Stethoscope size={28} color={selectedRole === 'doctor' ? Colors.surface : Colors.primary} />,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              style={styles.logoContainer}
            >
              <Heart size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join HealthConnect today</Text>
          </View>

          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.roleTitle}>I am a:</Text>
            <View style={styles.roleOptions}>
              {roleOptions.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleOption,
                    selectedRole === role.id && styles.roleOptionSelected,
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                >
                  <View style={[
                    styles.roleIconContainer,
                    selectedRole === role.id && styles.roleIconContainerSelected,
                  ]}>
                    {role.icon}
                  </View>
                  <View style={styles.roleTextContainer}>
                    <Text style={[
                      styles.roleOptionTitle,
                      selectedRole === role.id && styles.roleOptionTitleSelected,
                    ]}>
                      {role.title}
                    </Text>
                    <Text style={[
                      styles.roleOptionSubtitle,
                      selectedRole === role.id && styles.roleOptionSubtitleSelected,
                    ]}>
                      {role.subtitle}
                    </Text>
                  </View>
                  <View style={[
                    styles.roleCheckContainer,
                    selectedRole === role.id && styles.roleCheckContainerSelected,
                  ]}>
                    {selectedRole === role.id && (
                      <UserCheck size={20} color={Colors.surface} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
              icon={<User size={20} color={Colors.textSecondary} />}
            />

            <TextInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              icon={<Mail size={20} color={Colors.textSecondary} />}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              icon={<Lock size={20} color={Colors.textSecondary} />}
              secureTextEntry={!showPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.textSecondary} />
                  )}
                </TouchableOpacity>
              }
            />

            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon={<Lock size={20} color={Colors.textSecondary} />}
              secureTextEntry={!showConfirmPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={Colors.textSecondary} />
                  )}
                </TouchableOpacity>
              }
            />

            <Button 
              title={loading ? "Creating Account..." : "Create Account"} 
              onPress={handleSignUp}
              disabled={loading}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.signinRow}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
                <Text style={styles.signinLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xxl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  roleSection: {
    marginBottom: Spacing.xxxxl,
  },
  roleTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  roleOptions: {
    gap: Spacing.md,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray200,
    backgroundColor: Colors.surface,
  },
  roleOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  roleIconContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  roleTextContainer: {
    flex: 1,
  },
  roleOptionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  roleOptionTitleSelected: {
    color: Colors.surface,
  },
  roleOptionSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  roleOptionSubtitleSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  roleCheckContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleCheckContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  form: {
    marginBottom: Spacing.xxxxl,
  },
  footer: {
    alignItems: 'center',
  },
  signinRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  signinText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  signinLink: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  termsText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Regular',
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});