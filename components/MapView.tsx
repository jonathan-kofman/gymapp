import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { FitnessZone, Location } from '../types';

interface MapViewProps {
  userLocation: Location | null;
  fitnessZones: FitnessZone[];
  onZonePress: (zone: FitnessZone) => void;
}

const MapViewComponent: React.FC<MapViewProps> = ({ userLocation, fitnessZones, onZonePress }) => {
  if (!userLocation) return null;

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]}
      >
        <Marker
          coordinate={userLocation}
          title="Your Location"
          description="You are here"
        >
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
          </View>
        </Marker>
        
        {fitnessZones.map((zone) => (
          <React.Fragment key={zone.id}>
            <Marker
              coordinate={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              title={zone.name}
              description={`${zone.type} • ${zone.trainerCount} trainers`}
              onPress={() => onZonePress(zone)}
            >
              <View style={styles.zoneMarker}>
                <Text style={styles.zoneMarkerText}>{zone.trainerCount}</Text>
              </View>
            </Marker>
            
            <Circle
              center={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              radius={zone.radius}
              fillColor="rgba(0, 0, 0, 0.1)"
              strokeColor="rgba(0, 0, 0, 0.3)"
              strokeWidth={1}
            />
          </React.Fragment>
        ))}
              </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  zoneMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  zoneMarkerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MapViewComponent; 