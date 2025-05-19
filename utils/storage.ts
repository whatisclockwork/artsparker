import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for local storage
const KEYS = {
  PROMPT_COUNT: 'prompt_count',
  LAST_RESET_DATE: 'last_reset_date',
  DARK_MODE: 'dark_mode',
};

// Get the number of prompts used today
export async function getPromptCount(): Promise<number> {
  try {
    const count = await AsyncStorage.getItem(KEYS.PROMPT_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Error getting prompt count:', error);
    return 0;
  }
}

// Increment the prompt count
export async function incrementPromptCount(): Promise<number> {
  try {
    // Check if we need to reset the counter (new day)
    await checkAndResetPromptCount();
    
    const currentCount = await getPromptCount();
    const newCount = currentCount + 1;
    
    await AsyncStorage.setItem(KEYS.PROMPT_COUNT, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error incrementing prompt count:', error);
    return 0;
  }
}

// Add 10 more prompts after watching an ad
export async function addRewardedPrompts(): Promise<number> {
  try {
    const currentCount = await getPromptCount();
    // Subtract 10 from the count (equivalent to adding 10 more available prompts)
    // But don't go below 0
    const newCount = Math.max(0, currentCount - 10);
    
    await AsyncStorage.setItem(KEYS.PROMPT_COUNT, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error adding rewarded prompts:', error);
    return 0;
  }
}

// Check if it's a new day and reset the prompt count if needed
async function checkAndResetPromptCount(): Promise<void> {
  try {
    const lastResetDateStr = await AsyncStorage.getItem(KEYS.LAST_RESET_DATE);
    const currentDate = new Date().toDateString();
    
    if (!lastResetDateStr || lastResetDateStr !== currentDate) {
      // It's a new day, reset the prompt count
      await AsyncStorage.setItem(KEYS.PROMPT_COUNT, '0');
      await AsyncStorage.setItem(KEYS.LAST_RESET_DATE, currentDate);
    }
  } catch (error) {
    console.error('Error checking/resetting prompt count:', error);
  }
}

// Save dark mode preference
export async function saveDarkModePreference(isDarkMode: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.DARK_MODE, isDarkMode ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving dark mode preference:', error);
  }
}

// Get dark mode preference
export async function getDarkModePreference(): Promise<boolean | null> {
  try {
    const preference = await AsyncStorage.getItem(KEYS.DARK_MODE);
    if (preference !== null) {
      return preference === 'true';
    }
    return null; // Use system default if not set
  } catch (error) {
    console.error('Error getting dark mode preference:', error);
    return null;
  }
}