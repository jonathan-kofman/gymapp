import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types';
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService,
  getCurrentUser,
  validateToken 
} from '../utils/auth';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true, 
        isLoading: false 
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await validateToken();
      if (token) {
        const user = await getCurrentUser();
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const result = await loginService(credentials);
      
      if (result.success && result.user && result.token) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: result.user, token: result.token } });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const result = await registerService(credentials);
      
      if (result.success && result.user && result.token) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: result.user, token: result.token } });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        Alert.alert('Registration Failed', result.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      Alert.alert('Registration Error', 'Something went wrong. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutService();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      // Here you would typically make an API call to update the user on the server
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};