import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FitnessZone, Trainer } from '../types';
import LocationCard from './LocationCard';
import TrainerCard from './TrainerCard';
import { getZoneIcon } from '../utils/placesApi';

interface ListViewProps {
  fitnessZones: FitnessZone[];
  trainers: Trainer[];
  onZonePress: (zone: FitnessZone) => void;
  onTrainerPress: (trainer: Trainer) => void;
}

const ListView: React.FC<ListViewProps> = ({ 
  fitnessZones, 
  trainers, 
  onZonePress, 
  onTrainerPress 
}) => {
  return (
    <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>🏃</Text>
          <Text style={styles.quickActionText}>Running</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>🏋️</Text>
          <Text style={styles.quickActionText}>Strength</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>🧘</Text>
          <Text style={styles.quickActionText}>Yoga</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionIcon}>🏊</Text>
          <Text style={styles.quickActionText}>Swimming</Text>
        </TouchableOpacity>
      </View>

      {/* Locations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Locations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {fitnessZones.map((zone) => (
            <LocationCard 
              key={zone.id} 
              zone={zone} 
              onPress={() => onZonePress(zone)} 
            />
          ))}
        </ScrollView>
      </View>

      {/* Trainers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Trainers</Text>
        {trainers.map((trainer) => (
          <TrainerCard 
            key={trainer.id} 
            trainer={trainer} 
            onPress={() => onTrainerPress(trainer)} 
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});

export default ListView; 