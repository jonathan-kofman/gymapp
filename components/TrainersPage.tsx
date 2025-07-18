import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Trainer } from '../types';
import { TrainerService } from '../utils/trainerService';

interface TrainersPageProps {
  onBack: () => void;
  trainers: Trainer[];
  onTrainerPress: (trainer: Trainer) => void;
}

const TrainersPage: React.FC<TrainersPageProps> = ({
  onBack,
  trainers: initialTrainers,
  onTrainerPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [loading, setLoading] = useState(false);

  // Load trainers when component mounts
  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const approvedTrainers = await TrainerService.getApprovedTrainers();
      setTrainers(approvedTrainers);
    } catch (error) {
      console.error('Error loading trainers:', error);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const searchResults = await TrainerService.searchTrainers(query);
        setTrainers(searchResults);
      } catch (error) {
        console.error('Error searching trainers:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // If search is empty, load all trainers
      loadTrainers();
    }
  };

  const handleTrainerPress = (trainer: Trainer) => {
    onTrainerPress(trainer);
  };



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Trainers</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search trainers..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Trainers List */}
      <ScrollView style={styles.trainersList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading trainers...</Text>
          </View>
        ) : trainers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trainers found</Text>
          </View>
        ) : (
          trainers.map((trainer) => (
            <View key={trainer.id} style={styles.trainerCard}>
              <View style={styles.trainerInfo}>
                <Image source={{ uri: trainer.avatar }} style={styles.trainerAvatar} />
                <View style={styles.trainerDetails}>
                  <Text style={styles.trainerName}>{trainer.name}</Text>
                  <Text style={styles.trainerSpecialty}>{trainer.specialty}</Text>
                  <View style={styles.trainerStats}>
                    <Text style={styles.trainerRating}>★ {trainer.rating}</Text>
                    <Text style={styles.trainerExperience}>{trainer.experience} years</Text>
                    <Text style={styles.trainerRate}>${trainer.hourlyRate}/hr</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.trainerActions}>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleTrainerPress(trainer)}
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSpacer: {
    width: 50,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  trainersList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  trainerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trainerInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  trainerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  trainerDetails: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  trainerSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  trainerStats: {
    flexDirection: 'row',
    gap: 15,
  },
  trainerRating: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '500',
  },
  trainerExperience: {
    fontSize: 12,
    color: '#666',
  },
  trainerRate: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  trainerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  filesButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  filesButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TrainersPage; 