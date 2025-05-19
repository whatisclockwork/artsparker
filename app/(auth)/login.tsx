import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { StarryBackground } from '@/components/ui/StarryBackground';
import { useSession } from '@/components/auth/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { COLORS } from '@/utils/theme';

export default function LoginScreen() {
  const { signIn } = useSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        let errorMessage = 'Failed to sign in';
        
        if (signInError.message === 'Invalid login credentials') {
          errorMessage = 'The email or password you entered is incorrect. Please check your credentials and try again.';
        } else if (signInError.message === 'over_request_rate_limit') {
          errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
        }
        
        setError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Sign In Failed',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });
      } else if (data?.session) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Sign in successful',
          position: 'top',
        });
        router.replace('/(tabs)');
      } else {
        throw new Error('No session returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
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
          <Text style={styles.title}>Sign In</Text>
          
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
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={COLORS.textTertiary}
              secureTextEntry
            />
          </View>
          
          <Button
            label="SIGN IN"
            onPress={handleSignIn}
            variant="primary"
            loading={loading}
            style={styles.signInButton}
          />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
  signInButton: {
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
  signUpLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
});