// Google Places API utility for fetching real fitness locations
// You'll need to get a Google Places API key from: https://developers.google.com/maps/documentation/places/web-service/get-api-key

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  rating?: number;
  address?: string;
  phone?: string;
  website?: string;
  openNow?: boolean;
  photos?: string[];
}

interface FitnessZone {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  type: string;
  trainerCount: number;
  description?: string;
  rating?: number;
  address?: string;
  phone?: string;
  website?: string;
  openNow?: boolean;
  photos?: string[];
}

const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Replace with your actual API key

const FITNESS_PLACE_TYPES = [
  'gym',
  'health',
  'park',
  'playground',
  'basketball_court',
  'tennis_court',
  'soccer_field',
  'baseball_field',
  'swimming_pool',
  'fitness_center',
  'yoga_studio',
  'pilates_studio',
  'crossfit_gym',
  'martial_arts_school',
  'dance_studio',
  'rock_climbing_gym',
  'boxing_gym',
  'cycling_studio',
  'running_track',
  'outdoor_fitness_equipment'
];

export const fetchNearbyFitnessLocations = async (
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<FitnessZone[]> => {
  try {
    const locations: FitnessZone[] = [];
    let idCounter = 1;

    // Fetch different types of fitness locations
    for (const placeType of FITNESS_PLACE_TYPES) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${placeType}&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        data.results.forEach((place: any) => {
          const fitnessZone: FitnessZone = {
            id: idCounter++,
            name: place.name,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            radius: 200, // Default radius for display
            type: mapPlaceTypeToZoneType(placeType),
            trainerCount: Math.floor(Math.random() * 15) + 1, // Mock trainer count
            description: place.vicinity || place.formatted_address,
            rating: place.rating,
            address: place.vicinity,
            phone: place.formatted_phone_number,
            website: place.website,
            openNow: place.opening_hours?.open_now,
            photos: place.photos?.map((photo: any) => 
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
            )
          };
          
          locations.push(fitnessZone);
        });
      }

      // Add delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return locations;
  } catch (error) {
    console.error('Error fetching fitness locations:', error);
    return getMockFitnessZones(); // Fallback to mock data
  }
};

const mapPlaceTypeToZoneType = (placeType: string): string => {
  const typeMap: { [key: string]: string } = {
    'gym': 'gym',
    'health': 'gym',
    'fitness_center': 'gym',
    'yoga_studio': 'studio',
    'pilates_studio': 'studio',
    'crossfit_gym': 'gym',
    'martial_arts_school': 'studio',
    'dance_studio': 'studio',
    'rock_climbing_gym': 'gym',
    'boxing_gym': 'gym',
    'cycling_studio': 'studio',
    'park': 'outdoor',
    'playground': 'playground',
    'basketball_court': 'court',
    'tennis_court': 'court',
    'soccer_field': 'field',
    'baseball_field': 'field',
    'swimming_pool': 'pool',
    'running_track': 'track',
    'outdoor_fitness_equipment': 'outdoor'
  };
  
  return typeMap[placeType] || 'outdoor';
};

// Fallback mock data if API is not available
export const getMockFitnessZones = (): FitnessZone[] => {
  return [
    {
      id: 1,
      name: 'Downtown Fitness Zone',
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 500,
      type: 'gym',
      trainerCount: 12,
      description: 'Premium gym with state-of-the-art equipment',
      rating: 4.5,
      address: '123 Main St, San Francisco, CA',
      openNow: true
    },
    {
      id: 2,
      name: 'Golden Gate Park Training Area',
      latitude: 37.7849,
      longitude: -122.4094,
      radius: 300,
      type: 'outdoor',
      trainerCount: 8,
      description: 'Outdoor fitness area with beautiful park views',
      rating: 4.3,
      address: 'Golden Gate Park, San Francisco, CA',
      openNow: true
    },
    {
      id: 3,
      name: 'Ocean Beach Workout Zone',
      latitude: 37.7649,
      longitude: -122.4294,
      radius: 400,
      type: 'beach',
      trainerCount: 15,
      description: 'Beach training with ocean views',
      rating: 4.7,
      address: 'Ocean Beach, San Francisco, CA',
      openNow: true
    },
    {
      id: 4,
      name: 'Mission District Sports Court',
      latitude: 37.7599,
      longitude: -122.4148,
      radius: 200,
      type: 'court',
      trainerCount: 6,
      description: 'Basketball and tennis courts',
      rating: 4.2,
      address: 'Mission District, San Francisco, CA',
      openNow: true
    },
    {
      id: 5,
      name: 'Presidio Playground Fitness',
      latitude: 37.7989,
      longitude: -122.4662,
      radius: 350,
      type: 'playground',
      trainerCount: 4,
      description: 'Family-friendly fitness area with playground equipment',
      rating: 4.4,
      address: 'Presidio, San Francisco, CA',
      openNow: true
    }
  ];
};

export const getZoneColor = (type: string): string => {
  switch (type) {
    case 'gym': return '#4CAF50';
    case 'studio': return '#9C27B0';
    case 'outdoor': return '#2196F3';
    case 'beach': return '#FF9800';
    case 'court': return '#F44336';
    case 'field': return '#795548';
    case 'pool': return '#00BCD4';
    case 'track': return '#607D8B';
    case 'playground': return '#E91E63';
    default: return '#666';
  }
};

export const getZoneIcon = (type: string): string => {
  switch (type) {
    case 'gym': return '🏋️';
    case 'studio': return '🧘';
    case 'outdoor': return '🌳';
    case 'beach': return '🏖️';
    case 'court': return '🏀';
    case 'field': return '⚽';
    case 'pool': return '🏊';
    case 'track': return '🏃';
    case 'playground': return '🎪';
    default: return '📍';
  }
}; 