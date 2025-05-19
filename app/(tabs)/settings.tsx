import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSession } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { StarryBackground } from '@/components/ui/StarryBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';
import { LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const { session, signOut } = useSession();
  const router = useRouter();
  
  const handleSignInPress = () => {
    router.push('/(auth)/login');
  };
  
  return (
    <View style={styles.container}>
      <StarryBackground />
      <SafeAreaView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Settings</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            {session ? (
              <View style={styles.accountInfo}>
                <Text style={styles.emailText}>{session.user.email}</Text>
                <TouchableOpacity 
                  style={styles.signOutButton} 
                  onPress={signOut}
                >
                  <LogOut size={18} color={COLORS.textSecondary} />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                label="SIGN IN"
                onPress={handleSignInPress}
                variant="primary"
              />
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <Text style={styles.description}>
              Art Sparker generates creative prompts to inspire artists using AI.
            </Text>
            
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 20,
    color: '#4AFF91',
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
    textShadow: '0px 2px 4px rgba(74, 255, 145, 0.2)',
  },
  section: {
    backgroundColor: 'rgba(74, 255, 145, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(74, 255, 145, 0.2)',
  },
  sectionTitle: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
    color: '#4AFF91',
    marginBottom: 16,
    textShadow: '0px 2px 4px rgba(74, 255, 145, 0.2)',
  },
  accountInfo: {
    gap: 8,
  },
  emailText: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: COLORS.text,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signOutText: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  description: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  version: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});