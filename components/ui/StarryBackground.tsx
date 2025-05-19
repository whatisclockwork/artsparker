import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/utils/theme';

type StarProps = {
  top: string;
  left: string;
  size: number;
  delay: number;
};

const Star: React.FC<StarProps> = ({ top, left, size, delay }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: Math.random() * 0.5 + 0.5, // Random brightness
          duration: 1000 + Math.random() * 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.1,
          duration: 1000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    
    animation.start();
    
    return () => {
      animation.stop();
    };
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.star,
        {
          top,
          left,
          width: size,
          height: size,
          opacity,
        },
      ]}
    />
  );
};

const generateStars = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 1.5 + 1,
    delay: Math.random() * 3000,
  }));
};

export const StarryBackground: React.FC = () => {
  // Use useRef to maintain the same star positions across re-renders
  const stars = useRef(generateStars()).current;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A1A', '#131342']}
        style={styles.gradient}
      />
      {stars.map((star) => (
        <Star
          key={star.id}
          top={star.top}
          left={star.left}
          size={star.size}
          delay={star.delay}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
  },
});