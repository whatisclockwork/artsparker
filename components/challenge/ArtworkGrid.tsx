import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { useSession } from '@/components/auth/AuthProvider';
import { Heart } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';
import { likeArtwork } from '@/utils/challenge';
import Toast from 'react-native-toast-message';

type Submission = {
  id: string;
  imageUrl: string;
  title: string;
  author: {
    id: string;
    name: string;
    profileLink?: string | null;
  };
  likes: number;
  hasLiked: boolean;
};

type ArtworkGridProps = {
  submissions: Submission[];
  onRefresh: () => void;
};

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  submissions,
  onRefresh
}) => {
  const { session } = useSession();
  const [loadingLikes, setLoadingLikes] = useState<Record<string, boolean>>({});
  const [localSubmissions, setLocalSubmissions] = useState<Submission[]>(submissions);
  const windowWidth = Dimensions.get('window').width;
  const itemWidth = windowWidth <= 600 ? windowWidth / 2 - 32 : windowWidth / 3 - 32;

  useEffect(() => {
    setLocalSubmissions(submissions);
  }, [submissions]);

  const handleLike = async (submissionId: string) => {
    if (!session) {
      Toast.show({
        type: 'error',
        text1: 'Sign in required',
        text2: 'Please sign in to like artworks',
        position: 'top',
      });
      return;
    }

    try {
      setLoadingLikes(prev => ({ ...prev, [submissionId]: true }));

      setLocalSubmissions(prev => prev.map(submission => {
        if (submission.id === submissionId) {
          const newHasLiked = !submission.hasLiked;
          return {
            ...submission,
            hasLiked: newHasLiked,
            likes: submission.likes + (newHasLiked ? 1 : -1)
          };
        }
        return submission;
      }));

      await likeArtwork(submissionId);
      onRefresh();
    } catch (error) {
      console.error('Error liking artwork:', error);

      setLocalSubmissions(prev => prev.map(submission => {
        if (submission.id === submissionId) {
          const newHasLiked = !submission.hasLiked;
          return {
            ...submission,
            hasLiked: !newHasLiked,
            likes: submission.likes + (newHasLiked ? -1 : 1)
          };
        }
        return submission;
      }));

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update like. Please try again.',
        position: 'top',
      });
    } finally {
      setLoadingLikes(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  if (localSubmissions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No submissions yet. Be the first to submit your artwork!
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Submission }) => (
    <View style={[styles.item,




Se