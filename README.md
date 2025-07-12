# Gym Buddy - Fitness Location Finder

A React Native app that helps users find nearby fitness locations including gyms, parks, playgrounds, courts, and more.

## Features

- 🗺️ **Interactive Map**: View your location and nearby fitness spots
- 📍 **Real Locations**: Fetches actual gyms, parks, courts, and fitness centers
- 🔍 **Search & Filter**: Find specific types of locations
- 📞 **Contact Info**: Call locations directly from the app
- 🌐 **Website Links**: Visit location websites
- 🗺️ **Directions**: Get directions to any location
- ⭐ **Ratings**: See user ratings for locations
- 🕐 **Open/Closed Status**: Check if locations are currently open
- 👥 **Trainer Profiles**: Browse available trainers at each location

## Setup Instructions

### 1. Get Google Places API Key

To fetch real fitness locations, you need a Google Places API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure API Key

1. Open `utils/placesApi.ts`
2. Replace `YOUR_GOOGLE_PLACES_API_KEY` with your actual API key:

```typescript
const GOOGLE_PLACES_API_KEY = 'your_actual_api_key_here';
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## How It Works

### Location Types Supported

The app searches for these types of fitness locations:

- **Gyms**: Fitness centers, health clubs, CrossFit gyms
- **Studios**: Yoga, Pilates, dance, martial arts studios
- **Outdoor**: Parks, outdoor fitness equipment
- **Courts**: Basketball, tennis courts
- **Fields**: Soccer, baseball fields
- **Pools**: Swimming pools
- **Tracks**: Running tracks
- **Playgrounds**: Family fitness areas

### API Integration

The app uses Google Places API to fetch real data including:

- Location names and addresses
- GPS coordinates
- User ratings
- Phone numbers
- Websites
- Opening hours
- Photos (when available)

### Fallback System

If the API is unavailable or you don't have an API key, the app falls back to mock data to ensure it always works.

## Features in Detail

### Map View
- Interactive map showing your location
- Color-coded markers for different location types
- Click markers to see details
- Radius circles showing coverage areas

### List View
- Horizontal scrolling cards for each location
- Shows ratings, open/closed status
- Quick access to location details

### Location Details
- Full location information
- Contact buttons (call, website, directions)
- Trainer listings
- Search functionality

### Trainer Profiles
- Browse available trainers
- See specialties and rates
- Book training sessions

## API Rate Limits

Google Places API has rate limits:
- 1000 requests per day for free tier
- 100 requests per 100 seconds
- The app includes delays to avoid hitting limits

## Troubleshooting

### Location Not Working
- Ensure location permissions are granted
- Check GPS is enabled
- Try refreshing the app

### No Locations Found
- Check your API key is correct
- Verify Places API is enabled
- Check internet connection
- App will show mock data as fallback

### Map Not Loading
- Ensure you have internet connection
- Check Google Maps API is enabled
- Try switching between map and list views

## Development

### Project Structure
```
GymApp/
├── App.tsx                 # Main app component
├── utils/
│   └── placesApi.ts       # Google Places API integration
├── assets/                 # Images and static files
└── package.json           # Dependencies
```

### Adding New Location Types

To add new fitness location types:

1. Add to `FITNESS_PLACE_TYPES` in `placesApi.ts`
2. Add mapping in `mapPlaceTypeToZoneType()`
3. Add color and icon in `getZoneColor()` and `getZoneIcon()`

## License

This project is for educational purposes. Please respect Google Places API terms of service.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your API key setup
3. Check console logs for errors 