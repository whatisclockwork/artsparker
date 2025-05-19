import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSession } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { StarryBackground } from '@/components/ui/StarryBackground';
import { WeeklyChallenge } from '@/components/challenge/WeeklyChallenge';
import { ArtSubmissionModal } from '@/components/challenge/ArtSubmissionModal';
import { ArtworkGrid } from '@/components/challenge/ArtworkGrid';
import { Loader } from '@/components/ui/Loader';
import { getChallengeData } from '@/utils/challenge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/utils/theme';

export default function ChallengeScreen() {
  const { session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [weeklyChallenge, setWeeklyChallenge] = useState({
    id: '1',
    prompt: 'A mystical dragon is gardening in a crystal cave',
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    submissions: []
  });
  
  const loadChallenge = async () => {
    try {
      const data = await getChallengeData();
      if (data) {
        setWeeklyChallenge(data);
      }
    } catch (error) {
      console.error('Failed to load challenge data', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadChallenge();
  }, []);
  
  const handleSubmitPress = () => {
    if (!session) {
      router.push('/(auth)/login');
      return;
    }
    
    setShowSubmitModal(true);
  };
  
  const handleSubmissionSuccess = () => {
    loadChallenge(); // Refresh the submissions grid
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <StarryBackground />
        <SafeAreaView style={styles.centered}>
          <Loader />
        </SafeAreaView>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StarryBackground />
      <SafeAreaView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Image 
              source={{ uri: 'https://i.ibb.co/43dPHwn/weeklychallengesmall.png' }}
              style={styles.titleImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.makeArtText}>Make art from this 👇</Text>
          
          <WeeklyChallenge
            prompt={weeklyChallenge.prompt}
            endDate={weeklyChallenge.endDate}
          />
          
          <Button
            label="SUBMIT YOUR ART"
            onPress={handleSubmitPress}
            variant="primary"
            style={styles.submitButton}
          />
          
          <Text style={styles.submissionsTitle}>Community Submissions</Text>
          
          <ArtworkGrid 
            submissions={weeklyChallenge.submissions} 
            onRefresh={loadChallenge}
          />
        </ScrollView>
      </SafeAreaView>
      
      <ArtSubmissionModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        challengeId={weeklyChallenge.id}
        onSubmissionSuccess={handleSubmissionSuccess}
      />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    height: 100,
    justifyContent: 'center',
    marginTop: 8,
  },
  titleImage: {
    width: '100%',
    height: '100%',
  },
  makeArtText: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
    color: '#4AFF91',
    textAlign: 'center',
    marginBottom: 8,
    textShadow: '0px 2px 4px rgba(74, 255, 145, 0.2)',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  submissionsTitle: {
    fontFamily: 'PressStart2P',
    fontSize: 20,
    color: '#4AFF91',
    marginBottom: 16,
    textShadow: '0px 2px 4px rgba(74, 255, 145, 0.2)',
  },
});