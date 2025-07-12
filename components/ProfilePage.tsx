import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { state: authState, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    goals: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (authState.user) {
      setProfile({
        name: authState.user.name || '',
        email: authState.user.email || '',
        phone: authState.user.phone || '',
        age: authState.user.age || '',
        height: authState.user.height || '',
        weight: authState.user.weight || '',
        fitnessLevel: authState.user.fitnessLevel || '',
        goals: authState.user.goals || '',
        emergencyContact: authState.user.emergencyContact || '',
        emergencyPhone: authState.user.emergencyPhone || ''
      });
    }
  }, [authState.user]);

  const handleSave = async () => {
    try {
      await updateProfile(profile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (authState.user) {
      setProfile({
        name: authState.user.name || '',
        email: authState.user.email || '',
        phone: authState.user.phone || '',
        age: authState.user.age || '',
        height: authState.user.height || '',
        weight: authState.user.weight || '',
        fitnessLevel: authState.user.fitnessLevel || '',
        goals: authState.user.goals || '',
        emergencyContact: authState.user.emergencyContact || '',
        emergencyPhone: authState.user.emergencyPhone || ''
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Rest of the component remains the same as your original ProfilePage
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)} 
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({...profile, name: text})}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => setProfile({...profile, email: text})}
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.email}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.phone}
                onChangeText={(text) => setProfile({...profile, phone: text})}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.phone}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.age}
                onChangeText={(text) => setProfile({...profile, age: text})}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.age} years</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Height</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.height}
                onChangeText={(text) => setProfile({...profile, height: text})}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.height}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Weight</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.weight}
                onChangeText={(text) => setProfile({...profile, weight: text})}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.weight}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Fitness Level</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.fitnessLevel}
                onChangeText={(text) => setProfile({...profile, fitnessLevel: text})}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.fitnessLevel}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Fitness Goals</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.goals}
                onChangeText={(text) => setProfile({...profile, goals: text})}
                multiline
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.goals}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.emergencyContact}
                onChangeText={(text) => setProfile({...profile, emergencyContact: text})}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.emergencyContact}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile.emergencyPhone}
                onChangeText={(text) => setProfile({...profile, emergencyPhone: text})}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.emergencyPhone}</Text>
            )}
          </View>
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Keep the same styles as your original ProfilePage
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFF',
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  input: {
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfilePage;