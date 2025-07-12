import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { fetchNearbyFitnessLocations, getMockFitnessZones } from './utils/placesApi';
import { mockTrainers } from './data/mockData';
import { Location as LocationType, FitnessZone, Trainer } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import LoadingScreen from './components/LoadingScreen';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MapView from './components/MapView';
import ListView from './components/ListView';
import LocationModal from './components/LocationModal';
import TrainerModal from './components/TrainerModal';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import BookingsPage from './components/BookingsPage';
import HelpPage from './components/HelpPage';

const MainApp: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [fitnessZones, setFitnessZones] = useState<FitnessZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<FitnessZone | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [trainerModalVisible, setTrainerModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMap, setShowMap] = useState<boolean>(true);
  const [fetchingLocations, setFetchingLocations] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'profile' | 'settings' | 'bookings' | 'help'>('main');

  useEffect(() => {
    if (authState.isAuthenticated) {
      requestLocationPermission();
      setTrainers(mockTrainers);
    }
  }, [authState.isAuthenticated]);

  const requestLocationPermission = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Alert.alert('Location Required', 'Please enable location to find nearby trainers.');
        setUserLocation({ latitude: 37.7749, longitude: -122.4194 });
        setLoading(false);
        setFitnessZones(getMockFitnessZones());
      }
    } catch (err) {
      console.warn(err);
      setUserLocation({ latitude: 37.7749, longitude: -122.4194 });
      setLoading(false);
      setFitnessZones(getMockFitnessZones());
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      setLoading(false);
      await fetchFitnessLocations(latitude, longitude);
    } catch (error) {
      console.log(error);
      Alert.alert('Location Error', 'Unable to get your location. Please check GPS settings.');
      setUserLocation({ latitude: 37.7749, longitude: -122.4194 });
      setLoading(false);
      setFitnessZones(getMockFitnessZones());
    }
  };

  const fetchFitnessLocations = async (latitude: number, longitude: number): Promise<void> => {
    setFetchingLocations(true);
    try {
      const locations = await fetchNearbyFitnessLocations(latitude, longitude, 5000);
      setFitnessZones(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setFitnessZones(getMockFitnessZones());
    } finally {
      setFetchingLocations(false);
    }
  };

  const onZonePress = (zone: FitnessZone): void => {
    setSelectedZone(zone);
    const zoneTrainers = mockTrainers.filter(trainer => trainer.zoneId === zone.id);
    setTrainers(zoneTrainers);
    setModalVisible(true);
  };

  const onTrainerPress = (trainer: Trainer): void => {
    setSelectedTrainer(trainer);
    setTrainerModalVisible(true);
  };

  const onHireTrainer = (): void => {
    if (!selectedTrainer) return;
    
    Alert.alert(
      'Book Session',
      `Book with ${selectedTrainer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => {
            Alert.alert('Booked!', 'Your trainer will contact you shortly.');
            setTrainerModalVisible(false);
            setModalVisible(false);
          }
        },
      ]
    );
  };

  const onCallLocation = (): void => {
    if (!selectedZone?.phone) {
      Alert.alert('Unavailable', 'Phone number not available.');
      return;
    }
    // Linking.openURL(`tel:${selectedZone.phone}`);
  };

  const onVisitWebsite = (): void => {
    if (!selectedZone?.website) {
      Alert.alert('Unavailable', 'Website not available.');
      return;
    }
    // Linking.openURL(selectedZone.website);
  };

  const onGetDirections = (): void => {
    if (!selectedZone) return;
    const { latitude, longitude } = selectedZone;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    // Linking.openURL(url);
  };

  const handleProfileOption = (option: string): void => {
    switch (option) {
      case 'Profile':
        setCurrentPage('profile');
        break;
      case 'Settings':
        setCurrentPage('settings');
        break;
      case 'Bookings':
        setCurrentPage('bookings');
        break;
      case 'Help':
        setCurrentPage('help');
        break;
      case 'Logout':
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Logout', 
              onPress: () => logout(),
              style: 'destructive'
            },
          ]
        );
        break;
      default:
        console.log(`Selected option: ${option}`);
    }
  };

  const handleBackToMain = (): void => {
    setCurrentPage('main');
  };

  const filteredTrainers: Trainer[] = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading screen while checking auth status
  if (authState.isLoading) {
    return <LoadingScreen />;
  }

  // Show auth screens if not authenticated
  if (!authState.isAuthenticated) {
    return <AuthWrapper />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  // Render different pages based on currentPage state
  if (currentPage === 'profile') {
    return <ProfilePage onBack={handleBackToMain} />;
  }

  if (currentPage === 'settings') {
    return <SettingsPage onBack={handleBackToMain} />;
  }

  if (currentPage === 'bookings') {
    return <BookingsPage onBack={handleBackToMain} />;
  }

  if (currentPage === 'help') {
    return <HelpPage onBack={handleBackToMain} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <Header showMap={showMap} onToggleView={setShowMap} onProfileOption={handleProfileOption} />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {fetchingLocations && (
        <View style={styles.loadingBanner}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.loadingBannerText}>Updating locations...</Text>
        </View>
      )}

      {showMap ? (
        <MapView 
          userLocation={userLocation}
          fitnessZones={fitnessZones}
          onZonePress={onZonePress}
        />
      ) : (
        <ListView 
          fitnessZones={fitnessZones}
          trainers={filteredTrainers}
          onZonePress={onZonePress}
          onTrainerPress={onTrainerPress}
        />
      )}

      <LocationModal
        visible={modalVisible}
        selectedZone={selectedZone}
        trainers={filteredTrainers}
        onClose={() => setModalVisible(false)}
        onTrainerPress={onTrainerPress}
        onGetDirections={onGetDirections}
        onCallLocation={onCallLocation}
        onVisitWebsite={onVisitWebsite}
      />

      <TrainerModal
        visible={trainerModalVisible}
        selectedTrainer={selectedTrainer}
        onClose={() => setTrainerModalVisible(false)}
        onBookSession={onHireTrainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  loadingBannerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;