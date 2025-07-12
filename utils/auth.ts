import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterCredentials } from '../types';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Mock user database - in production, this would be your backend API
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    age: '28',
    height: '5\'10"',
    weight: '165 lbs',
    fitnessLevel: 'Intermediate',
    goals: 'Build muscle and improve strength',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'demo@demo.com',
    password: 'demo123',
    name: 'Demo User',
    phone: '+1 (555) 000-0000',
    age: '25',
    height: '5\'8"',
    weight: '140 lbs',
    fitnessLevel: 'Beginner',
    goals: 'Get fit and healthy',
    emergencyContact: 'Emergency Contact',
    emergencyPhone: '+1 (555) 111-1111',
    createdAt: new Date().toISOString(),
  }
];

interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Remove password from user object
    const { password, ...userWithoutPassword } = user;
    
    // Generate mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword, token };
  } catch (error) {
    return { success: false, message: 'Login failed' };
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === credentials.email);
    if (existingUser) {
      return { success: false, message: 'User already exists with this email' };
    }
    
    // Validate passwords match
    if (credentials.password !== credentials.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Remove password from user object
    const { password, ...userWithoutPassword } = newUser;
    
    // Generate mock token
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword, token };
  } catch (error) {
    return { success: false, message: 'Registration failed' };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const validateToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    // In a real app, you'd validate the token with your backend
    return token;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

export const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;
    
    const updatedUser = { ...currentUser, ...userData };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    return true;
  } catch (error) {
    console.error('Update profile error:', error);
    return false;
  }
};