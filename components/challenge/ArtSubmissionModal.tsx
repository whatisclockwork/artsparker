import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  Alert,
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
  const [description, setDescription] = useState('');
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

    if (!image) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select an image',
        position: 'top',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await submitArtwork({
        challengeId,
        title,
        description,
        imageUri: image,
      });
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your artwork has been submitted!',
        position: 'top',
      });
      
      // Reset form and close modal
      resetForm();
      onClose();
      
      // Trigger grid refresh
      onSubmissionSuccess?.();
      
    } catch (error) {
      console.error('Error submitting artwork:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit artwork. Please try again.',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={COLORS.textSecondary} size={24} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Submit Your Artwork</Text>
          
          <TouchableOpacity 
            style={styles.imageUpload} 
            onPress={pickImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Upload color={COLORS.textSecondary} size={32} />
                <Text style={styles.uploadText}>Tap to select image</Text>
                <Text style={styles.uploadHint}>(JPG or PNG)</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title (Optional)</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Give your artwork a title"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Share your thoughts about your artwork"
              placeholderTextColor={COLORS.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <Button
            label="SUBMIT"
            onPress={handleSubmit}
            variant="primary"
            loading={loading}
            disabled={!image || challengeId === 'placeholder'}
            style={styles.submitButton}
          />
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 26, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(163, 79, 222, 0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  imageUpload: {
    height: 200,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  uploadHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    marginTop: 8,
  },
});