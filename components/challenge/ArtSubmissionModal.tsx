import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { COLORS } from '@/utils/theme';
import { X, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { submitArtwork } from '@/utils/challenge';
import Toast from 'react-native-toast-message';

type ArtSubmissionModalProps = {
  visible: boolean;
  onClose: () => void;
  challengeId: string;
  onSubmissionSuccess?: () => void;
};

export const ArtSubmissionModal: React.FC<ArtSubmissionModalProps> = ({
  visible,
  onClose,
  challengeId,
  onSubmissionSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (challengeId === 'placeholder') {
      Toast.show({
        type: 'error',
        text1: 'Submissions Closed',
        text2: 'Submissions are currently closed. Please wait for the next challenge.',
        position: 'top',
      });
      return;
    }

    if (!image || !title || !username) {
      Toast.show({
        type: 'error',
        text1: 'Missing Info',
        text2: 'Please provide a title, username, and image.',
        position: 'top',
      });
      return;
    }

    setLoading(true);

    try {
      await submitArtwork({
        challengeId,
        title,
        imageUri: image,
        displayName: username,
        profileLink: profileLink || null,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your art has been submitted!',
        position: 'top',
      });

      setTitle('');
      setUsername('');
      setProfileLink('');
      setImage(null);
      onSubmissionSuccess?.();
      onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Something went wrong. Please try again.',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#fff" size={20} />
          </TouchableOpacity>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name or handle"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Art Page / Social Link (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://yourpage.com"
            placeholderTextColor="#888"
            value={profileLink}
            onChangeText={setProfileLink}
          />

          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Button label="Pick an image" onPress={pickImage} Icon={Upload} />
          )}

          <Button
            label={loading ? 'Uploading...' : 'Submit'}
            onPress={handleSubmit}
            disabled={loading}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    borderRadius: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  label: {
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 12,
  },
});
