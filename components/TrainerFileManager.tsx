import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { TrainerFileService, TrainerFile } from '../utils/trainerFiles';

interface TrainerFileManagerProps {
  trainerId: string;
  visible: boolean;
  onClose: () => void;
}

export const TrainerFileManager: React.FC<TrainerFileManagerProps> = ({
  trainerId,
  visible,
  onClose,
}) => {
  const [files, setFiles] = useState<TrainerFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileDescription, setFileDescription] = useState('');

  useEffect(() => {
    if (visible) {
      loadFiles();
    }
  }, [visible, trainerId]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const trainerFiles = await TrainerFileService.getTrainerFiles(trainerId);
      setFiles(trainerFiles);
    } catch (error) {
      Alert.alert('Error', 'Failed to load trainer files');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      if (!file) {
        Alert.alert('Error', 'No file selected');
        return;
      }

      setUploading(true);
      setShowUploadModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
      console.error(error);
    }
  };

  const confirmUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets[0]) {
        setShowUploadModal(false);
        setFileDescription('');
        return;
      }

      const file = result.assets[0];
      
      // Convert file to blob for upload
      const response = await fetch(file.uri);
      const blob = await response.blob();

      await TrainerFileService.uploadTrainerFile(
        trainerId,
        blob,
        file.name,
        fileDescription.trim() || undefined
      );

      Alert.alert('Success', 'File uploaded successfully');
      loadFiles();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
      console.error(error);
    } finally {
      setUploading(false);
      setShowUploadModal(false);
      setFileDescription('');
    }
  };

  const handleFileDelete = async (fileId: string) => {
    Alert.alert(
      'Delete File',
      'Are you sure you want to delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await TrainerFileService.deleteTrainerFile(fileId, trainerId);
              Alert.alert('Success', 'File deleted successfully');
              loadFiles();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete file');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return '📷';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    return '📁';
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trainer Files</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text style={styles.uploadButtonText}>📁 Upload File</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading files...</Text>
          </View>
        ) : (
          <ScrollView style={styles.fileList}>
            {files.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No files uploaded yet</Text>
              </View>
            ) : (
              files.map((file) => (
                <View key={file.id} style={styles.fileItem}>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileIcon}>
                      {getFileIcon(file.fileType)}
                    </Text>
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName}>{file.fileName}</Text>
                      <Text style={styles.fileDate}>
                        {formatDate(file.uploadDate)}
                      </Text>
                      {file.description && (
                        <Text style={styles.fileDescription}>
                          {file.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.fileActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        // Handle file download/view
                        Alert.alert('File', `Viewing: ${file.fileName}`);
                      }}
                    >
                      <Text style={styles.actionButtonText}>👁️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleFileDelete(file.id)}
                    >
                      <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* Upload Modal */}
        <Modal visible={showUploadModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Upload File</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="File description (optional)"
                value={fileDescription}
                onChangeText={setFileDescription}
                multiline
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowUploadModal(false);
                    setFileDescription('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Upload</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  fileList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  fileItem: {
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  fileDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  fileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  actionButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 