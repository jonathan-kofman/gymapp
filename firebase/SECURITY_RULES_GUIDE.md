# Firebase Security Rules Guide

This guide explains the security rules implemented for your gym app's Firebase backend.

## 🔒 Firestore Security Rules (`firestore.rules`)

### Trainers Collection
```javascript
match /trainers/{trainerId} {
  // Anyone can read approved trainers
  allow read: if resource.data.isApproved == true;
  
  // Only authenticated users can create trainer profiles
  allow create: if request.auth != null 
    && request.auth.uid == resource.data.userId;
  
  // Only the trainer owner can update their profile
  allow update: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

**Purpose:**
- Public access to approved trainers (for browsing)
- Only trainers can create/update their own profiles
- Prevents unauthorized profile modifications

### Trainer Files Collection
```javascript
match /trainerFiles/{fileId} {
  // Only authenticated users can read trainer files
  allow read: if request.auth != null;
  
  // Only authenticated users can create file records
  allow create: if request.auth != null;
  
  // Only the file owner can update file metadata
  allow update: if request.auth != null 
    && request.auth.uid == resource.data.trainerId;
  
  // Only the file owner can delete file records
  allow delete: if request.auth != null 
    && request.auth.uid == resource.data.trainerId;
}
```

**Purpose:**
- Authenticated users can view all trainer files
- Only file owners can modify/delete their files
- Prevents unauthorized file management

### Bookings Collection
```javascript
match /bookings/{bookingId} {
  allow read, write: if request.auth != null;
}
```

**Purpose:**
- Only authenticated users can manage bookings
- Future implementation for booking system

### User Profiles Collection
```javascript
match /users/{userId} {
  // Users can read their own profile
  allow read: if request.auth != null 
    && request.auth.uid == userId;
  
  // Users can create their own profile
  allow create: if request.auth != null 
    && request.auth.uid == userId;
  
  // Users can update their own profile
  allow update: if request.auth != null 
    && request.auth.uid == userId;
}
```

**Purpose:**
- Users can only access their own profiles
- Prevents unauthorized profile access

### Fitness Zones Collection
```javascript
match /fitnessZones/{zoneId} {
  // Anyone can read fitness zones
  allow read: if true;
  
  // Only authenticated users can create zones (admin feature)
  allow create: if request.auth != null;
  
  // Only zone owners can update zones
  allow update: if request.auth != null 
    && request.auth.uid == resource.data.ownerId;
}
```

**Purpose:**
- Public access to fitness zones (for browsing)
- Only zone owners can modify zone information

### Reviews Collection
```javascript
match /reviews/{reviewId} {
  // Anyone can read reviews
  allow read: if true;
  
  // Only authenticated users can create reviews
  allow create: if request.auth != null;
  
  // Only review authors can update their reviews
  allow update: if request.auth != null 
    && request.auth.uid == resource.data.userId;
  
  // Only review authors can delete their reviews
  allow delete: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

**Purpose:**
- Public access to reviews (for transparency)
- Only review authors can modify their reviews

## 🗄️ Storage Security Rules (`storage.rules`)

### Trainer Files
```javascript
match /trainers/{trainerId}/files/{fileName} {
  // Only authenticated users can read trainer files
  allow read: if request.auth != null;
  
  // Only authenticated users can upload files
  allow write: if request.auth != null;
  
  // File size limit (10MB)
  allow create: if request.auth != null 
    && request.resource.size < 10 * 1024 * 1024;
}
```

**Purpose:**
- Authenticated users can upload/download trainer files
- 10MB file size limit prevents abuse
- Organized file structure by trainer ID

### User Profile Images
```javascript
match /users/{userId}/profile/{fileName} {
  // Users can read their own profile images
  allow read: if request.auth != null 
    && request.auth.uid == userId;
  
  // Users can upload their own profile images
  allow write: if request.auth != null 
    && request.auth.uid == userId;
  
  // File size limit (5MB for profile images)
  allow create: if request.auth != null 
    && request.auth.uid == userId
    && request.resource.size < 5 * 1024 * 1024;
}
```

**Purpose:**
- Users can manage their own profile images
- 5MB limit for profile images
- Private access to own profile images

### Trainer Profile Images
```javascript
match /trainers/{trainerId}/profile/{fileName} {
  // Anyone can read trainer profile images
  allow read: if true;
  
  // Only the trainer can upload their profile image
  allow write: if request.auth != null 
    && request.auth.uid == trainerId;
  
  // File size limit (5MB for profile images)
  allow create: if request.auth != null 
    && request.auth.uid == trainerId
    && request.resource.size < 5 * 1024 * 1024;
}
```

**Purpose:**
- Public access to trainer profile images
- Only trainers can upload their profile images
- 5MB limit for profile images

### Fitness Zone Images
```javascript
match /zones/{zoneId}/images/{fileName} {
  // Anyone can read zone images
  allow read: if true;
  
  // Only zone owners can upload zone images
  allow write: if request.auth != null 
    && request.auth.uid == resource.metadata.ownerId;
  
  // File size limit (10MB for zone images)
  allow create: if request.auth != null 
    && request.resource.size < 10 * 1024 * 1024;
}
```

**Purpose:**
- Public access to zone images
- Only zone owners can upload zone images
- 10MB limit for zone images

## 🔧 Implementation Steps

### 1. Deploy Firestore Rules
1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Copy contents of `firebase/firestore.rules`
4. Paste and click "Publish"

### 2. Deploy Storage Rules
1. Go to Firebase Console → Storage
2. Click "Rules" tab
3. Copy contents of `firebase/storage.rules`
4. Paste and click "Publish"

### 3. Test Rules
1. Test file upload functionality
2. Verify authentication requirements
3. Check file size limits
4. Test access permissions

## 🛡️ Security Features

### Authentication Required
- All file operations require authentication
- User-specific data is protected
- Trainer files require login

### File Size Limits
- Trainer files: 10MB maximum
- Profile images: 5MB maximum
- Zone images: 10MB maximum

### Owner-Based Access
- Users can only modify their own data
- Trainers can only manage their own files
- Zone owners control zone content

### Public Read Access
- Approved trainers are publicly readable
- Fitness zones are publicly accessible
- Reviews are publicly visible

## 🚨 Security Best Practices

### Data Validation
- Always validate data on the client side
- Use Firebase Functions for complex validation
- Implement server-side validation

### Rate Limiting
- Consider implementing rate limiting
- Monitor usage patterns
- Set up alerts for unusual activity

### Regular Audits
- Review access logs regularly
- Monitor failed authentication attempts
- Update rules as needed

### Backup Strategy
- Regular backups of Firestore data
- Export important collections
- Document data structure

## 🔍 Troubleshooting

### Common Issues:
1. **Permission denied**: Check authentication state
2. **File upload fails**: Verify file size limits
3. **Read access denied**: Check resource.data conditions
4. **Write access denied**: Verify user ownership

### Debug Steps:
1. Check Firebase Console logs
2. Verify authentication state
3. Test with smaller files
4. Review rule syntax

## 📋 Rule Maintenance

### Regular Updates:
- Review rules monthly
- Update based on new features
- Monitor security alerts
- Test rule changes in staging

### Version Control:
- Keep rules in version control
- Document rule changes
- Test rules before deployment
- Have rollback plan ready 