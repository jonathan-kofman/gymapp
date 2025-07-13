# Firebase Setup for Gym App

This guide will help you set up Firebase for trainer file management in your gym app.

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication** (for user management)
   - **Firestore Database** (for storing file metadata)
   - **Storage** (for storing actual files)

## 2. Firebase Configuration

1. In your Firebase project, go to Project Settings
2. Add a new app (Web app) if you haven't already
3. Copy the configuration object
4. Replace the placeholder values in `firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 3. Firestore Security Rules

Copy the contents of `firebase/firestore.rules` to your Firestore database rules in the Firebase Console:

**Firestore Database → Rules → Edit Rules**

The rules include:
- **Trainers collection** - Approved trainers are publicly readable, only owners can update
- **Trainer files collection** - Authenticated users can manage files
- **Bookings collection** - Authenticated users can manage bookings
- **User profiles** - Users can only access their own profiles
- **Fitness zones** - Public read access, authenticated create/update
- **Reviews** - Public read access, authenticated create/update/delete

## 4. Storage Security Rules

Copy the contents of `firebase/storage.rules` to your Firebase Storage rules in the Firebase Console:

**Storage → Rules → Edit Rules**

The rules include:
- **Trainer files** - Authenticated users can upload/download (10MB limit)
- **User profile images** - Users can manage their own profile images (5MB limit)
- **Trainer profile images** - Trainers can manage their profile images (5MB limit)
- **Fitness zone images** - Zone owners can upload zone images (10MB limit)
- **File size limits** - Prevents abuse and controls storage costs

## 5. Installation

Install the required dependencies:

```bash
npm install
# or
yarn install
```

## 6. Usage

### Using the TrainerFileManager Component

```typescript
import { TrainerFileManager } from './components/TrainerFileManager';

// In your component
const [showFileManager, setShowFileManager] = useState(false);

// Render the component
<TrainerFileManager
  trainerId="trainer123"
  visible={showFileManager}
  onClose={() => setShowFileManager(false)}
/>
```

### Using the TrainerFileService directly

```typescript
import { TrainerFileService } from './utils/trainerFiles';

// Upload a file
const fileData = await TrainerFileService.uploadTrainerFile(
  trainerId,
  fileBlob,
  fileName,
  description
);

// Get trainer files
const files = await TrainerFileService.getTrainerFiles(trainerId);

// Delete a file
await TrainerFileService.deleteTrainerFile(fileId, trainerId);
```

## 7. Features

The Firebase integration provides:

- **File Upload**: Upload any type of file with optional description
- **File Management**: View, organize, and delete trainer files
- **Metadata Storage**: File information stored in Firestore
- **File Storage**: Actual files stored in Firebase Storage
- **Security**: Authentication-based access control
- **Real-time Updates**: Files sync across devices

## 8. File Structure

```
trainers/
├── {trainerId}/
│   └── files/
│       ├── {fileId}_1.pdf
│       ├── {fileId}_2.jpg
│       └── {fileId}_3.mp4
```

## 9. Troubleshooting

### Common Issues:

1. **Firebase not initialized**: Make sure to import the config file before using Firebase services
2. **Permission denied**: Check your Firestore and Storage security rules
3. **File upload fails**: Ensure you have proper internet connectivity and file size limits
4. **Authentication issues**: Make sure users are properly authenticated before accessing files

### Environment Variables (Optional)

For better security, you can use environment variables:

1. Create a `.env` file in your project root
2. Add your Firebase config:

```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

3. Update `firebase/config.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
```

## 10. Next Steps

- Implement file preview functionality
- Add file sharing capabilities
- Implement file versioning
- Add file search and filtering
- Implement file access permissions
- Add file upload progress indicators 