import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { signIn } from '@/services/firebaseService';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill out both fields.');
      return;
    }
    
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

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
              colors={['#004D80', '#4695EB']}
              style={styles.logoContainer}
            >
              <Heart size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>HealthConnect</Text>
            <Text style={styles.subtitle}>Your Health, Unified as One</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              icon={<Mail size={20} color="#6B7280" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              icon={<Lock size={20} color="#6B7280" />}
              secureTextEntry={!showPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              }
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button 
              title={loading ? "Signing In..." : "Sign In"} 
              onPress={handleSignIn}
              disabled={loading}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              By signing in, you agree to our{' '}
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
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#004D80',
  },
  footer: {
    alignItems: 'center',
  },
  signupRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#004D80',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#004D80',
    textDecorationLine: 'underline',
  },
});