import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'solid' | 'outline';
  buttonStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  type = 'solid',
  buttonStyle,
  titleStyle,
}) => {
  const { theme, isDark } = useTheme();

  const buttonStyles = StyleSheet.create({
    button: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      ...(type === 'solid' && {
        backgroundColor: isDark ? '#0A84FF' : '#007AFF',
      }),
      ...(type === 'outline' && {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      }),
      ...(disabled && {
        opacity: 0.5,
      }),
      ...buttonStyle,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: type === 'solid' ? 'white' : theme.text,
      ...titleStyle,
    },
  });

  return (
    <TouchableOpacity
      style={buttonStyles.button}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading && <ActivityIndicator size="small" color={type === 'solid' ? 'white' : theme.text} />}
      <Text style={buttonStyles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  disabled = false,
  inputStyle,
  leftIcon,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
}) => {
  const { theme, isDark } = useTheme();

  const inputStyles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      ...(disabled && {
        opacity: 0.6,
      }),
      ...inputStyle,
    },
    leftIconContainer: {
      marginRight: 12,
    },
  });

  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={inputStyles.inputContainer}>
        {leftIcon && <View style={inputStyles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}; 