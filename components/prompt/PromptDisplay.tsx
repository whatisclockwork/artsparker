import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/utils/theme';

type PromptDisplayProps = {
  prompt: string;
  isLoading: boolean;
};

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ 
  prompt, 
  isLoading 
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isLoading) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.5,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.3,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading]);
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.promptContainer}>
        <Text style={styles.prompt}>
          {(prompt || 'PRESS INSPIRE ME TO START') + ''}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4AFF91',
    shadowColor: '#4AFF91',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 200,
    marginVertical: 8,
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  prompt: {
    fontFamily: 'PressStart2P',
    fontSize: 18,
    color: '#4AFF91',
    textAlign: 'center',
    textShadowColor: 'rgba(74, 255, 145, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 32,
  },
});