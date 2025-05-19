import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/utils/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{this.state.error?.message}</Text>
          {__DEV__ && this.state.errorInfo?.componentStack && (
            <Text style={styles.details}>{this.state.errorInfo.componentStack}</Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: COLORS.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  details: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ErrorBoundary;