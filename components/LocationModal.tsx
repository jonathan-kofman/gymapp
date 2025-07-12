import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { FitnessZone, Trainer } from '../types';
import TrainerCard from './TrainerCard';

interface LocationModalProps {
  visible: boolean;
  selectedZone: FitnessZone | null;
  trainers: Trainer[];
  onClose: () => void;
  onTrainerPress: (trainer: Trainer) => void;
  onGetDirections: () => void;
  onCallLocation: () => void;
  onVisitWebsite: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  selectedZone,
  trainers,
  onClose,
  onTrainerPress,
  onGetDirections,
  onCallLocation,
  onVisitWebsite,
}) => {
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
              <Text style={styles.modalTitle}>{selectedZone?.name}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>{selectedZone?.description}</Text>
          </View>
          
          <View style={styles.modalDetails}>
            {selectedZone?.rating && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rating</Text>
                <Text style={styles.detailValue}>★ {selectedZone.rating}</Text>
              </View>
            )}
            {selectedZone?.address && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{selectedZone.address}</Text>
              </View>
            )}
            {selectedZone?.openNow !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[styles.detailValue, { color: selectedZone.openNow ? '#00C853' : '#FF5252' }]}>
                  {selectedZone.openNow ? 'Open Now' : 'Closed'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={onGetDirections}>
              <Text style={styles.actionBtnText}>Directions</Text>
            </TouchableOpacity>
            {selectedZone?.phone && (
              <TouchableOpacity style={styles.actionBtn} onPress={onCallLocation}>
                <Text style={styles.actionBtnText}>Call</Text>
              </TouchableOpacity>
            )}
            {selectedZone?.website && (
              <TouchableOpacity style={styles.actionBtn} onPress={onVisitWebsite}>
                <Text style={styles.actionBtnText}>Website</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.modalTrainers}>
            <Text style={styles.modalTrainersTitle}>Available Trainers</Text>
            <FlatList
              data={trainers}
              renderItem={({ item }) => (
                <TrainerCard 
                  trainer={item} 
                  onPress={() => onTrainerPress(item)} 
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
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
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    fontSize: 28,
    color: '#CCC',
    fontWeight: '300',
  },
  modalDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  modalTrainers: {
    flex: 1,
  },
  modalTrainersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
});

export default LocationModal; 