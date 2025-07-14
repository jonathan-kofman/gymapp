// Firebase Error Handling Utility
// Centralized error handling for all Firebase operations

export interface FirebaseError {
  code: string;
  message: string;
  details?: any;
}

export class ErrorHandler {
  
  // Firebase error codes and their user-friendly messages
  private static readonly ERROR_MESSAGES = {
    // Authentication errors
    'auth/user-not-found': 'User account not found. Please check your credentials.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'This email is already registered. Please use a different email.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/invalid-email': 'Invalid email address. Please enter a valid email.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    
    // Firestore errors
    'permission-denied': 'You don\'t have permission to perform this action.',
    'unavailable': 'Service temporarily unavailable. Please try again.',
    'deadline-exceeded': 'Request timed out. Please try again.',
    'resource-exhausted': 'Service quota exceeded. Please try again later.',
    'failed-precondition': 'Operation failed due to invalid state.',
    'aborted': 'Operation was aborted. Please try again.',
    'out-of-range': 'Requested data is out of range.',
    'unimplemented': 'This feature is not yet implemented.',
    'internal': 'Internal server error. Please try again.',
    'data-loss': 'Data loss occurred. Please try again.',
    'unauthenticated': 'You must be logged in to perform this action.',
    
    // Storage errors
    'storage/unauthorized': 'You don\'t have permission to access this file.',
    'storage/canceled': 'Upload was canceled.',
    'storage/unknown': 'Unknown storage error occurred.',
    'storage/invalid-checksum': 'File upload failed due to corruption.',
    'storage/retry-limit-exceeded': 'Upload failed after multiple attempts.',
    'storage/invalid-event-name': 'Invalid upload event.',
    'storage/invalid-url': 'Invalid file URL.',
    'storage/invalid-argument': 'Invalid upload parameters.',
    'storage/no-default-bucket': 'No default storage bucket configured.',
    'storage/cannot-slice-blob': 'File cannot be processed.',
    'storage/server-file-wrong-size': 'File size mismatch on server.',
    
    // Custom app errors
    'trainer/not-found': 'Trainer not found.',
    'trainer/not-approved': 'This trainer is not yet approved.',
    'file/too-large': 'File is too large. Maximum size is 10MB.',
    'file/invalid-type': 'File type not supported.',
    'booking/not-available': 'This time slot is not available.',
    'booking/already-booked': 'You have already booked this session.',
  };

  // Get user-friendly error message
  static getErrorMessage(error: any): string {
    const errorCode = error?.code || error?.message || 'unknown-error';
    
    // Check if we have a custom message for this error
    if (this.ERROR_MESSAGES[errorCode]) {
      return this.ERROR_MESSAGES[errorCode];
    }
    
    // Fallback to generic messages based on error type
    if (errorCode.includes('auth/')) {
      return 'Authentication error. Please check your credentials and try again.';
    }
    
    if (errorCode.includes('storage/')) {
      return 'File upload error. Please try again or contact support.';
    }
    
    if (errorCode.includes('permission-denied')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    if (errorCode.includes('network') || errorCode.includes('unavailable')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // Default error message
    return 'An unexpected error occurred. Please try again.';
  }

  // Log error for debugging
  static logError(error: any, context?: string): void {
    const errorInfo = {
      code: error?.code || 'unknown',
      message: error?.message || 'No message',
      context: context || 'Unknown context',
      timestamp: new Date().toISOString(),
      stack: error?.stack,
    };
    
    console.error('Firebase Error:', errorInfo);
    
    // In production, you might want to send this to a logging service
    // like Firebase Crashlytics or Sentry
  }

  // Handle Firebase errors with user-friendly messages
  static handleError(error: any, context?: string): FirebaseError {
    this.logError(error, context);
    
    return {
      code: error?.code || 'unknown-error',
      message: this.getErrorMessage(error),
      details: error,
    };
  }

  // Check if error is retryable
  static isRetryableError(error: any): boolean {
    const retryableCodes = [
      'unavailable',
      'deadline-exceeded',
      'resource-exhausted',
      'aborted',
      'network-request-failed',
      'storage/retry-limit-exceeded',
    ];
    
    return retryableCodes.includes(error?.code);
  }

  // Get retry delay based on error type
  static getRetryDelay(error: any, attempt: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    
    if (error?.code === 'resource-exhausted') {
      return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    }
    
    if (error?.code === 'too-many-requests') {
      return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    }
    
    return baseDelay * attempt;
  }

  // Validate Firebase configuration
  static validateFirebaseConfig(config: any): boolean {
    const requiredFields = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId'
    ];
    
    for (const field of requiredFields) {
      if (!config[field] || config[field] === 'your-' + field.replace(/([A-Z])/g, '-$1').toLowerCase()) {
        console.error(`Missing or invalid Firebase config field: ${field}`);
        return false;
      }
    }
    
    return true;
  }

  // Check if user is authenticated
  static isAuthenticated(user: any): boolean {
    return user && user.uid && !user.isAnonymous;
  }

  // Check if user has required permissions
  static hasPermission(user: any, requiredRole?: string): boolean {
    if (!this.isAuthenticated(user)) {
      return false;
    }
    
    if (requiredRole) {
      // In a real app, you might check user roles from Firestore
      return user.role === requiredRole;
    }
    
    return true;
  }

  // Format error for display in UI
  static formatErrorForUI(error: FirebaseError): {
    title: string;
    message: string;
    action?: string;
  } {
    let title = 'Error';
    let action: string | undefined;
    
    // Set appropriate title and action based on error type
    if (error.code.includes('auth/')) {
      title = 'Authentication Error';
      action = 'Please check your credentials and try again.';
    } else if (error.code.includes('storage/')) {
      title = 'File Upload Error';
      action = 'Please try uploading a smaller file or different format.';
    } else if (error.code.includes('permission-denied')) {
      title = 'Permission Denied';
      action = 'Please contact support if you believe this is an error.';
    } else if (error.code.includes('network')) {
      title = 'Network Error';
      action = 'Please check your internet connection and try again.';
    }
    
    return {
      title,
      message: error.message,
      action,
    };
  }
} 