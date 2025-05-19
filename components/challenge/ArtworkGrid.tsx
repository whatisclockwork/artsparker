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
  onRefresh,
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
    <View style={[styles.item, { width: itemWidth }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title || 'Untitled'}
        </Text>
        <Text style={styles.itemAuthor} numberOfLines={1}>
          by {item.author.name || 'Anonymous'}
        </Text>
        {item.author.profileLink && (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.author.profileLink!)}
            style={styles.profileLinkContainer}
          >
            <Text style={styles.profileLink} numberOfLines={2}>
              {item.author.profileLink}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => handleLike(item.id)}
          disabled={loadingLikes[item.id]}
        >
          <Heart
            size={16}
            color={item.hasLiked ? COLORS.primary : COLORS.textSecondary}
            fill={item.hasLiked ? COLORS.primary : 'none'}
          />
          <Text style={[
            styles.likeCount,
            item.hasLiked && styles.likedCount
          ]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={localSubmissions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={windowWidth <= 600 ? 2 : 3}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  item: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: COLORS.text,
    marginBottom: 4,
  },
  itemAuthor: {
    fontFamily: 'PressStart2P',
    fontSize: 8,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  profileLinkContainer: {
    marginBottom: 8,
  },
  profileLink: {
    fontFamily: 'PressStart2P',
    fontSize: 8,
    color: COLORS.textTertiary,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontFamily: 'PressStart2P',
    fontSize: 8,
    color: COLORS.textSecondary,
  },
  likedCount: {
    color: COLORS.primary,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});