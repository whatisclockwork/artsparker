import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { StarryBackground } from '@/components/ui/StarryBackground';
import { useSession } from '@/components/auth/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { COLORS } from '@/utils/theme';

export default function SignUpScreen() {
  const { signUp } = useSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
        position: 'top',
      });
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const result = await signUp(email, password);
      
      if (result.error) {
        let errorMessage = result.error.message;
        
        // Handle specific error cases
        if (errorMessage.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else if (errorMessage.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (errorMessage.includes('Password')) {
          errorMessage = 'Password must be at least 6 characters long.';
        }
        
        setError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          position: 'top',
        });
      } else if (result.data?.user) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Sign up successful',
          position: 'top',
        });
        router.replace('/(tabs)');
      } else {
        throw new Error('No user data returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up. Please try again.';
      console.error('Signup error:', err);
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <StarryBackground />
      <SafeAreaView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              placeholderTextColor={COLORS.textTertiary}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={COLORS.textTertiary}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor={COLORS.textTertiary}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>
          
          <Button
            label="CREATE ACCOUNT"
            onPress={handleSignUp}
            variant="primary"
            loading={loading}
            style={styles.signUpButton}
          />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SafeAreaView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  signUpButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signInLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
});