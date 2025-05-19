// Color palette
export const COLORS = {
  // Main colors
  background: '#0A0A1A', // Deep navy background
  backgroundDark: '#05050F', // Darker background for cards and panels
  cardBackground: 'rgba(17, 17, 48, 0.7)', // Semi-transparent card backgrounds
  
  // Primary accent - gold/amber
  primary: '#FFB740', // Primary gold/amber
  primaryDark: '#E69B00', // Darker gold
  primaryLight: '#FFCF80', // Lighter gold
  
  // Secondary accent - violet/purple
  secondary: '#A34FDE', // Secondary violet
  secondaryDark: '#8025C9', // Darker violet
  secondaryLight: '#C78AEB', // Lighter violet
  
  // Text colors
  text: '#FFFFFF', // Primary text
  textSecondary: '#B8B8D0', // Secondary, less important text
  textTertiary: '#6E6E94', // Tertiary, least important text
  
  // Input and form elements
  inputBackground: 'rgba(10, 10, 30, 0.5)', // Input background
  
  // States
  success: '#4CAF50', // Success color
  error: '#F44336', // Error color
  warning: '#FFC107', // Warning color
  
  // Shared styles - transparency levels useful for overlays
  overlay10: 'rgba(10, 10, 30, 0.1)',
  overlay20: 'rgba(10, 10, 30, 0.2)',
  overlay40: 'rgba(10, 10, 30, 0.4)',
  overlay60: 'rgba(10, 10, 30, 0.6)',
  overlay80: 'rgba(10, 10, 30, 0.8)',
};

// Typography scale
export const TYPOGRAPHY = {
  largeTitle: {
    fontSize: 32,
    fontFamily: 'Playfair-Bold',
  },
  title1: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
  },
  title2: {
    fontSize: 24,
    fontFamily: 'Playfair-SemiBold',
  },
  title3: {
    fontSize: 20,
    fontFamily: 'Playfair-SemiBold',
  },
  headline: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  captionMedium: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  small: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
};

// Spacing scale (based on 8px grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// Animation timings
export const ANIMATION = {
  fast: 200,
  medium: 300,
  slow: 500,
};