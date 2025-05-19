import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  AdMobRewarded,
  setTestDeviceIDAsync,
  requestTrackingPermissionsAsync,
} from 'expo-ads-admob';

const adUnitId = Platform.select({
  ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID,
  android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID,
}) ?? '';

export function useRewardedAd(onRewarded: () => void) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupAdMob = async () => {
      try {
        if (__DEV__) {
          await setTestDeviceIDAsync('EMULATOR');
        }

        if (Platform.OS !== 'web') {
          const { status } = await requestTrackingPermissionsAsync();
          console.log('Tracking permission status:', status);
        }

        await AdMobRewarded.setAdUnitID(adUnitId);
        
        AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', () => {
          onRewarded();
        });

        AdMobRewarded.addEventListener('rewardedVideoDidLoad', () => {
          setIsLoaded(true);
          setError(null);
        });

        AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', (error) => {
          setError('Failed to load ad');
          setIsLoaded(false);
          console.error('Ad failed to load:', error);
        });

        await AdMobRewarded.requestAdAsync();
      } catch (err) {
        setError('Failed to initialize ad');
        console.error('AdMob setup error:', err);
      }
    };

    setupAdMob();

    return () => {
      AdMobRewarded.removeAllListeners();
    };
  }, [onRewarded]);

  const showAd = async () => {
    try {
      if (!isLoaded) {
        throw new Error('Ad not loaded');
      }
      await AdMobRewarded.showAdAsync();
      return true;
    } catch (err) {
      setError('Failed to show ad');
      console.error('Show ad error:', err);
      return false;
    }
  };

  return {
    showAd,
    isLoaded,
    error,
  };
}