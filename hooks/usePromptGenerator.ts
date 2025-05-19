import { useState, useEffect } from 'react';
import { generateFullPrompt, generateCharacter, generateAction, generateLocation } from '@/utils/openai';
import { getPromptCount, incrementPromptCount, addRewardedPrompts } from '@/utils/storage';

// Daily prompt limit
const DAILY_PROMPT_LIMIT = 10;

export function usePromptGenerator() {
  const [prompt, setPrompt] = useState<string>('');
  const [character, setCharacter] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [promptsRemaining, setPromptsRemaining] = useState<number>(DAILY_PROMPT_LIMIT);
  
  // Load the initial prompt count on mount
  useEffect(() => {
    const loadPromptCount = async () => {
      const count = await getPromptCount();
      setPromptsRemaining(DAILY_PROMPT_LIMIT - count);
    };
    
    loadPromptCount();
  }, []);
  
  // Generate a full prompt (character, action, location)
  const generatePrompt = async () => {
    try {
      const count = await getPromptCount();
      if (count >= DAILY_PROMPT_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      
      setIsLoading(true);
      
      const generated = await generateFullPrompt();
      
      setCharacter(generated.character);
      setAction(generated.action);
      setLocation(generated.location);
      setPrompt(generated.fullPrompt);
      
      // Increment prompt count and update remaining
      const newCount = await incrementPromptCount();
      setPromptsRemaining(DAILY_PROMPT_LIMIT - newCount);
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate just a new character
  const changeCharacter = async () => {
    try {
      const count = await getPromptCount();
      if (count >= DAILY_PROMPT_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      
      setIsLoading(true);
      
      const newCharacter = await generateCharacter();
      setCharacter(newCharacter);
      setPrompt(`${newCharacter} is ${action} in ${location}`);
      
      // Increment prompt count and update remaining
      const newCount = await incrementPromptCount();
      setPromptsRemaining(DAILY_PROMPT_LIMIT - newCount);
    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate just a new action
  const changeAction = async () => {
    try {
      const count = await getPromptCount();
      if (count >= DAILY_PROMPT_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      
      setIsLoading(true);
      
      const newAction = await generateAction();
      setAction(newAction);
      setPrompt(`${character} is ${newAction} in ${location}`);
      
      // Increment prompt count and update remaining
      const newCount = await incrementPromptCount();
      setPromptsRemaining(DAILY_PROMPT_LIMIT - newCount);
    } catch (error) {
      console.error('Error generating action:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate just a new location
  const changeLocation = async () => {
    try {
      const count = await getPromptCount();
      if (count >= DAILY_PROMPT_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      
      setIsLoading(true);
      
      const newLocation = await generateLocation();
      setLocation(newLocation);
      setPrompt(`${character} is ${action} in ${newLocation}`);
      
      // Increment prompt count and update remaining
      const newCount = await incrementPromptCount();
      setPromptsRemaining(DAILY_PROMPT_LIMIT - newCount);
    } catch (error) {
      console.error('Error generating location:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Watch a rewarded ad to get more prompts
  const watchRewardedAd = async () => {
    // In a real app, this would show a rewarded ad using Expo's AdMob module
    // For now, we'll simulate watching an ad with a timeout
    setIsLoading(true);
    
    try {
      // Simulate ad watching delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Add 10 more prompts (this actually reduces the count by 10)
      const updatedCount = await addRewardedPrompts();
      setPromptsRemaining(DAILY_PROMPT_LIMIT - updatedCount);
      
      // Close the modal
      setShowLimitModal(false);
    } catch (error) {
      console.error('Error with rewarded ad:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    prompt,
    character,
    action,
    location,
    isLoading,
    promptsRemaining,
    showLimitModal,
    setShowLimitModal,
    generatePrompt,
    changeCharacter,
    changeAction,
    changeLocation,
    watchRewardedAd,
  };
}