import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { Trainer } from '../types';

interface TrainerModalProps {
  visible: boolean;
  selectedTrainer: Trainer | null;
  onClose: () => void;
  onBookSession: () => void;
}

const TrainerModal: React.FC<TrainerModalProps> = ({
  visible,
  selectedTrainer,
  onClose,
  onBookSession,
}) => {
  if (!selectedTrainer) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalTitle}>Trainer Details</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.trainerProfile}>
            <Image source={{ uri: selectedTrainer.avatar }} style={styles.trainerProfileImage} />
            <Text style={styles.trainerProfileName}>{selectedTrainer.name}</Text>
            <Text style={styles.trainerProfileSpecialty}>{selectedTrainer.specialty}</Text>
            
            <View style={styles.trainerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>★ {selectedTrainer.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedTrainer.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${selectedTrainer.hourlyRate}</Text>
                <Text style={styles.statLabel}>Per Hour</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.bookButton} onPress={onBookSession}>
                <Text style={styles.bookButtonText}>Book Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    fontSize: 28,
    color: '#CCC',
    fontWeight: '300',
  },
  trainerProfile: {
    alignItems: 'center',
  },
  trainerProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  trainerProfileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  trainerProfileSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  trainerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 12,
  },
  filesButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flex: 1,
  },
  filesButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flex: 1,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TrainerModal; 