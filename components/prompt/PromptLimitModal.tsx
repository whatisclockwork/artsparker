import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRewardedAd } from '@/components/ads/RewardedAd';
import { COLORS } from '@/utils/theme';
import { X } from 'lucide-react-native';

type PromptLimitModalProps = {
  visible: boolean;
  onClose: () => void;
  onWatchAd: () => void;
};

export const PromptLimitModal: React.FC<PromptLimitModalProps> = ({
  visible,
  onClose,
  onWatchAd,
}) => {
  const { showAd, isLoaded, error } = useRewardedAd(onWatchAd);

  const handleWatchAd = async () => {
    const success = await showAd();
    if (!success) {
      // Handle failure to show ad
      console.error('Failed to show ad');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={COLORS.textSecondary} size={24} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Daily Limit Reached</Text>
          
          <Text style={styles.description}>
            You've used all your free prompts for today. Watch a short ad to unlock 10 more prompts.
          </Text>
          
          {error ? (
            <Text style={styles.errorText}>
              {error}. Please try again later.
            </Text>
          ) : (
            <Button
              label="WATCH AD"
              onPress={handleWatchAd}
              variant="primary"
              style={styles.watchButton}
              disabled={!isLoaded}
            />
          )}
          
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.skipText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 26, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(163, 79, 222, 0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  watchButton: {
    marginBottom: 16,
  },
  skipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: 8,
  },
});