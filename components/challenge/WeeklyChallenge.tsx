import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/theme';
import { formatDistanceToNow } from '@/utils/date';

type WeeklyChallengeProps = {
  prompt: string;
  endDate: Date;
};

export const WeeklyChallenge: React.FC<WeeklyChallengeProps> = ({
  prompt,
  endDate,
}) => {
  const timeLeft = formatDistanceToNow(endDate);
  
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Time Left:</Text>
        <Text style={styles.timeValue}>{timeLeft}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(74, 255, 145, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(74, 255, 145, 0.2)',
  },
  prompt: {
    fontFamily: 'PressStart2P',
    fontSize: 20,
    color: '#4AFF91',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
    textShadow: '0px 2px 4px rgba(74, 255, 145, 0.2)',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 255, 145, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  timeLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  timeValue: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: '#4AFF91',
  },
});