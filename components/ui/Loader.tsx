import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '@/utils/theme';

export const Loader: React.FC = () => {
  const spinValue = new Animated.Value(0);
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <View style={styles.innerSpinner} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    padding: 5,
  },
  innerSpinner: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});