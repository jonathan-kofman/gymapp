import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Trainer } from '../types';

interface TrainerCardProps {
  trainer: Trainer;
  onPress: () => void;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onPress }) => {
  return (
    <TouchableOpacity style={styles.trainerCard} onPress={onPress}>
      <Image source={{ uri: trainer.avatar }} style={styles.trainerAvatar} />
      <View style={styles.trainerInfo}>
        <Text style={styles.trainerName}>{trainer.name}</Text>
        <Text style={styles.trainerSpecialty}>{trainer.specialty}</Text>
        <View style={styles.trainerMeta}>
          <Text style={styles.trainerRating}>★ {trainer.rating}</Text>
          <Text style={styles.trainerRate}>${trainer.hourlyRate}/hr</Text>
        </View>
      </View>
      <View style={styles.trainerAction}>
        <Text style={styles.actionArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  trainerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  trainerSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  trainerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerRating: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  trainerRate: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
  trainerAction: {
    marginLeft: 8,
  },
  actionArrow: {
    fontSize: 20,
    color: '#CCC',
    fontWeight: '300',
  },
});

export default TrainerCard; 