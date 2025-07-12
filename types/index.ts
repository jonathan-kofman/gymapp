export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  age?: string;
  height?: string;
  weight?: string;
  fitnessLevel?: string;
  goals?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface FitnessZone {
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

export interface Trainer {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  hourlyRate: number;
  experience: string;
  avatar: string;
  zoneId: number;
}