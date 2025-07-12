import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';

interface HeaderProps {
  showMap: boolean;
  onToggleView: (showMap: boolean) => void;
  onProfileOption: (option: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showMap, onToggleView, onProfileOption }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleProfilePress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionPress = (option: string) => {
    setDropdownVisible(false);
    onProfileOption(option);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>TrainerX</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Text style={styles.profileInitial}>U</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, !showMap && styles.toggleButtonActive]}
          onPress={() => onToggleView(false)}
        >
          <Text style={[styles.toggleText, !showMap && styles.toggleTextActive]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, showMap && styles.toggleButtonActive]}
          onPress={() => onToggleView(true)}
        >
          <Text style={[styles.toggleText, showMap && styles.toggleTextActive]}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Dropdown */}
      {dropdownVisible && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity 
            style={styles.dropdownBackdrop} 
            onPress={() => setDropdownVisible(false)}
          />
          <View style={styles.dropdownMenu}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Profile')}
            >
              <Text style={styles.dropdownItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Settings')}
            >
              <Text style={styles.dropdownItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Bookings')}
            >
              <Text style={styles.dropdownItemText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Help')}
            >
              <Text style={styles.dropdownItemText}>Help & Support</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => handleOptionPress('Logout')}
            >
              <Text style={[styles.dropdownItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#000',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 180,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  logoutText: {
    color: '#FF3B30',
  },
});

export default Header; 