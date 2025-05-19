import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/theme';

export const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ 
          uri: 'https://i.ibb.co/wNnrxN0P/artsparker80style.png'
        }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logo: {
    width: 624,
    height: 182,
    marginBottom: 4,
  },
});