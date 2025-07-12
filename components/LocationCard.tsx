import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FitnessZone } from '../types';
import { getZoneIcon } from '../utils/placesApi';

interface LocationCardProps {
  zone: FitnessZone;
  onPress: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ zone, onPress }) => {
  return (
    <TouchableOpacity style={styles.locationCard} onPress={onPress}>
      <View style={styles.locationImageContainer}>
        <Text style={styles.locationIcon}>{getZoneIcon(zone.type)}</Text>
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{zone.name}</Text>
        <Text style={styles.locationType}>{zone.type}</Text>
        <View style={styles.locationMeta}>
          {zone.rating && (
            <Text style={styles.locationRating}>★ {zone.rating}</Text>
          )}
          <Text style={styles.locationTrainers}>{zone.trainerCount} trainers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginLeft: 20,
    marginRight: 4,
    width: 160,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  locationImageContainer: {
    height: 80,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 28,
  },
  locationInfo: {
    padding: 12,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  locationType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  locationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRating: {
    fontSize: 12,
    color: '#666',
  },
  locationTrainers: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default LocationCard; 