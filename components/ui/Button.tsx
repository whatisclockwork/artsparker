import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '@/utils/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style = {},
  textStyle = {},
}) => {
  const buttonStyles: ViewStyle[] = [styles.button];
  const textStyles: TextStyle[] = [styles.text];
  
  switch (variant) {
    case 'primary':
      buttonStyles.push(styles.primaryButton);
      textStyles.push(styles.primaryText);
      break;
    case 'secondary':
      buttonStyles.push(styles.secondaryButton);
      textStyles.push(styles.secondaryText);
      break;
    case 'outline':
      buttonStyles.push(styles.outlineButton);
      textStyles.push(styles.outlineText);
      break;
  }
  
  if (disabled) {
    buttonStyles.push(styles.disabledButton);
    textStyles.push(styles.disabledText);
  }
  
  return (
    <TouchableOpacity
      style={[...buttonStyles, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? COLORS.primary : COLORS.background} 
          size="small" 
        />
      ) : (
        <Text style={[...textStyles, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  text: {
    fontFamily: 'PressStart2P',
    fontSize: 15.5, // Increased by another 10% from 14
    lineHeight: 20, // Adjusted line height to match new font size
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: COLORS.background,
  },
  secondaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.background,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  outlineText: {
    color: COLORS.text,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});