import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useSession } from '@/components/auth/AuthProvider';
import { PromptDisplay } from '@/components/prompt/PromptDisplay';
import { StarryBackground } from '@/components/ui/StarryBackground';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import {
  generateArtPrompt,
  generateCharacter,
  generateAction,
  generateLocation,
  generateImage,
} from '@/utils/openai';
import { PromptLimitModal } from '@/components/prompt/PromptLimitModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPromptCount, incrementPromptCount } from '@/utils/storage';
import { COLORS } from '@/utils/theme';

const DAILY_PROMPT_LIMIT = 10;
const IS_PRODUCTION = !__DEV__;

type PromptParts = {
  character: string;
  action: string;
  location: string;
};

export default function HomeScreen() {
  const [promptParts, setPromptParts] = useState<PromptParts>({
    character: '',
    action: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [promptsRemaining, setPromptsRemaining] = useState<number>(DAILY_PROMPT_LIMIT);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (IS_PRODUCTION) {
      loadPromptCount();
    }
  }, []);

  const loadPromptCount = async () => {
    const count = await getPromptCount();
    setPromptsRemaining(DAILY_PROMPT_LIMIT - count);
  };

  const checkPromptLimit = async () => {
    if (!IS_PRODUCTION) return true;
    const count = await getPromptCount();
    if (count >= DAILY_PROMPT_LIMIT) {
      setShowLimitModal(true);
      return false;
    }
    return true;
  };

  const updatePromptCount = async () => {
    if (!IS_PRODUCTION) return;
    const newCount = await incrementPromptCount();
    setPromptsRemaining(DAILY_PROMPT_LIMIT - newCount);
  };

  const parsePrompt = (prompt: string): PromptParts => {
    if (!prompt || typeof prompt !== 'string') {
      return { character: '', action: '', location: '' };
    }
    const pattern = /^(A|An) ([^"']+?) is ([^"']+?) ((in|on|at|beneath|among|behind|inside|near) .+?)\.?$/i;
    const match = prompt.trim().match(pattern);
    if (!match) {
      return { character: '', action: '', location: '' };
    }
    return {
      character: match[2].toLowerCase().trim(),
      action: match[3].toLowerCase().trim(),
      location: match[4].toLowerCase().trim(),
    };
  };

  const generatePrompt = async () => {
    if (!await checkPromptLimit()) return;
    try {
      setIsLoading(true);
      setGeneratedImage(null);
      const newPrompt = await generateArtPrompt();
      const parts = parsePrompt(newPrompt);
      setPromptParts(parts);
      await updatePromptCount();
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateCharacter = async () => {
    if (!await checkPromptLimit()) return;
    try {
      setIsLoading(true);
      setGeneratedImage(null);
      const newCharacter = await generateCharacter();
      setPromptParts(prev => ({ ...prev, character: newCharacter }));
      await updatePromptCount();
    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateAction = async () => {
    if (!await checkPromptLimit()) return;
    try {
      setIsLoading(true);
      setGeneratedImage(null);
      const newAction = await generateAction();
      setPromptParts(prev => ({ ...prev, action: newAction }));
      await updatePromptCount();
    } catch (error) {
      console.error('Error generating action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateLocation = async () => {
    if (!await checkPromptLimit()) return;
    try {
      setIsLoading(true);
      setGeneratedImage(null);
      const newLocation = await generateLocation();
      setPromptParts(prev => ({ ...prev, location: newLocation }));
      await updatePromptCount();
    } catch (error) {
      console.error('Error generating location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    const prompt = promptParts.character && promptParts.action && promptParts.location
      ? `A ${promptParts.character} is ${promptParts.action} ${promptParts.location}`
      : '';
    if (!prompt) return;

    try {
      setImageLoaded(false);
      setIsGeneratingImage(true);
      const imageUrl = await generateImage(prompt);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const fullPrompt = promptParts.character && promptParts.action && promptParts.location
    ? `A ${promptParts.character} is ${promptParts.action} ${promptParts.location}`
    : '';

  const watchRewardedAd = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPromptsRemaining(DAILY_PROMPT_LIMIT);
    setShowLimitModal(false);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <StarryBackground />
      <SafeAreaView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Header />
          <Button
            label="INSPIRE ME"
            onPress={generatePrompt}
            variant="primary"
            loading={isLoading}
            style={styles.inspireButton}
          />
          <PromptDisplay
            prompt={fullPrompt || 'PRESS INSPIRE ME TO START'}
            isLoading={isLoading}
          />
          <View style={styles.regenerateButtons}>
            <Button
              label="NEW CHARACTER"
              onPress={regenerateCharacter}
              variant="secondary"
              loading={isLoading}
              disabled={!promptParts.action || !promptParts.location}
              style={styles.regenerateButton}
            />
            <Button
              label="NEW ACTION"
              onPress={regenerateAction}
              variant="secondary"
              loading={isLoading}
              disabled={!promptParts.character || !promptParts.location}
              style={styles.regenerateButton}
            />
            <Button
              label="NEW LOCATION"
              onPress={regenerateLocation}
              variant="secondary"
              loading={isLoading}
              disabled={!promptParts.character || !promptParts.action}
              style={styles.regenerateButton}
            />
            <Button
              label={generatedImage ? "REGENERATE IMAGE" : "GENERATE IMAGE"}
              onPress={handleGenerateImage}
              variant="primary"
              loading={isGeneratingImage}
              disabled={!fullPrompt || isGeneratingImage}
              style={styles.generateImageButton}
            />
          </View>
          <View style={styles.imageContainer}>
            {generatedImage ? (
              <>
                {!imageLoaded && (
                  <Text style={styles.loadingText}>Rendering image...</Text>
                )}
                <Image
                  source={{ uri: generatedImage }}
                  style={styles.generatedImage}
                  resizeMode="contain"
                  onLoadEnd={() => setImageLoaded(true)}
                />
              </>
            ) : isGeneratingImage ? (
              <Text style={styles.loadingText}>Generating image...</Text>
            ) : (
              <Text style={styles.loadingText}>No image generated yet.</Text>
            )}
          </View>
          {IS_PRODUCTION && (
            <View style={styles.promptCounter}>
              <Text style={styles.promptCounterText}>
                {promptsRemaining} prompts remaining today
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {IS_PRODUCTION && (
        <PromptLimitModal
          visible={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          onWatchAd={watchRewardedAd}
        />
      )}
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
  inspireButton: {
    marginBottom: 12,
  },
  regenerateButtons: {
    marginTop: 16,
    gap: 8,
  },
  regenerateButton: {
    width: '100%',
  },
  generateImageButton: {
    width: '100%',
    marginTop: 8,
  },
  imageContainer: {
    marginTop: 24,
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatedImage: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: '#4AFF91',
    fontFamily: 'PressStart2P',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
  },
  promptCounter: {
    marginTop: 16,
    alignItems: 'center',
  },
  promptCounterText: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});
