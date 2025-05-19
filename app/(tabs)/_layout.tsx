import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Sparkles, Award, Settings } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Sparkles color={color} size={28} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="challenge/index"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Award color={color} size={28} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Settings color={color} size={28} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.backgroundDark,
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 10,
  },
  iconContainer: {
    alignSelf: 'center',
    marginHorizontal: 8,
  },
});