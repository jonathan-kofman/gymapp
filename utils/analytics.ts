// Firebase Analytics Utility
// Track user interactions and app performance

import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { app } from '../firebase/config';

// Initialize Analytics
const analytics = getAnalytics(app);

export class Analytics {
  
  // Track app events
  static trackEvent(eventName: string, parameters?: Record<string, any>): void {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Track user login
  static trackLogin(method: string): void {
    this.trackEvent('login', { method });
  }

  // Track user registration
  static trackSignUp(method: string): void {
    this.trackEvent('sign_up', { method });
  }

  // Track trainer view
  static trackTrainerView(trainerId: string, trainerName: string): void {
    this.trackEvent('trainer_view', {
      trainer_id: trainerId,
      trainer_name: trainerName,
    });
  }

  // Track trainer search
  static trackTrainerSearch(query: string, resultsCount: number): void {
    this.trackEvent('trainer_search', {
      search_query: query,
      results_count: resultsCount,
    });
  }

  // Track file upload
  static trackFileUpload(fileType: string, fileSize: number, trainerId: string): void {
    this.trackEvent('file_upload', {
      file_type: fileType,
      file_size: fileSize,
      trainer_id: trainerId,
    });
  }

  // Track file download
  static trackFileDownload(fileType: string, trainerId: string): void {
    this.trackEvent('file_download', {
      file_type: fileType,
      trainer_id: trainerId,
    });
  }

  // Track booking attempt
  static trackBookingAttempt(trainerId: string, trainerName: string): void {
    this.trackEvent('booking_attempt', {
      trainer_id: trainerId,
      trainer_name: trainerName,
    });
  }

  // Track booking completion
  static trackBookingComplete(trainerId: string, trainerName: string, amount: number): void {
    this.trackEvent('booking_complete', {
      trainer_id: trainerId,
      trainer_name: trainerName,
      amount: amount,
    });
  }

  // Track zone selection
  static trackZoneSelection(zoneId: number, zoneName: string): void {
    this.trackEvent('zone_selection', {
      zone_id: zoneId,
      zone_name: zoneName,
    });
  }

  // Track app screen view
  static trackScreenView(screenName: string, screenClass?: string): void {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  }

  // Track error
  static trackError(errorCode: string, errorMessage: string, context?: string): void {
    this.trackEvent('app_error', {
      error_code: errorCode,
      error_message: errorMessage,
      context: context || 'unknown',
    });
  }

  // Track performance
  static trackPerformance(metricName: string, value: number): void {
    this.trackEvent('performance', {
      metric_name: metricName,
      value: value,
    });
  }

  // Set user properties
  static setUserProperties(properties: Record<string, any>): void {
    try {
      setUserProperties(analytics, properties);
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  // Set user ID
  static setUserId(userId: string): void {
    try {
      setUserId(analytics, userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  // Track user engagement
  static trackEngagement(action: string, target: string, value?: any): void {
    this.trackEvent('user_engagement', {
      action,
      target,
      value: value || null,
    });
  }

  // Track feature usage
  static trackFeatureUsage(featureName: string, action: string): void {
    this.trackEvent('feature_usage', {
      feature_name: featureName,
      action,
    });
  }

  // Track app session
  static trackSessionStart(): void {
    this.trackEvent('session_start');
  }

  // Track app session end
  static trackSessionEnd(duration: number): void {
    this.trackEvent('session_end', {
      duration_seconds: duration,
    });
  }

  // Track onboarding completion
  static trackOnboardingComplete(stepsCompleted: string[]): void {
    this.trackEvent('onboarding_complete', {
      steps_completed: stepsCompleted,
    });
  }

  // Track tutorial completion
  static trackTutorialComplete(tutorialName: string, stepsCompleted: number): void {
    this.trackEvent('tutorial_complete', {
      tutorial_name: tutorialName,
      steps_completed: stepsCompleted,
    });
  }

  // Track push notification interaction
  static trackNotificationInteraction(notificationId: string, action: string): void {
    this.trackEvent('notification_interaction', {
      notification_id: notificationId,
      action,
    });
  }

  // Track deep link
  static trackDeepLink(link: string, source: string): void {
    this.trackEvent('deep_link', {
      link,
      source,
    });
  }

  // Track app update
  static trackAppUpdate(previousVersion: string, currentVersion: string): void {
    this.trackEvent('app_update', {
      previous_version: previousVersion,
      current_version: currentVersion,
    });
  }

  // Track crash
  static trackCrash(error: Error, context?: string): void {
    this.trackEvent('app_crash', {
      error_name: error.name,
      error_message: error.message,
      context: context || 'unknown',
    });
  }

  // Track network performance
  static trackNetworkPerformance(url: string, duration: number, status: number): void {
    this.trackEvent('network_performance', {
      url,
      duration_ms: duration,
      status_code: status,
    });
  }

  // Track battery usage
  static trackBatteryUsage(level: number, isCharging: boolean): void {
    this.trackEvent('battery_usage', {
      battery_level: level,
      is_charging: isCharging,
    });
  }

  // Track memory usage
  static trackMemoryUsage(usedMemory: number, totalMemory: number): void {
    this.trackEvent('memory_usage', {
      used_memory_mb: usedMemory,
      total_memory_mb: totalMemory,
    });
  }
}

// Predefined event names for consistency
export const ANALYTICS_EVENTS = {
  // User events
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  LOGOUT: 'logout',
  
  // Trainer events
  TRAINER_VIEW: 'trainer_view',
  TRAINER_SEARCH: 'trainer_search',
  TRAINER_BOOK: 'trainer_book',
  
  // File events
  FILE_UPLOAD: 'file_upload',
  FILE_DOWNLOAD: 'file_download',
  FILE_DELETE: 'file_delete',
  
  // Booking events
  BOOKING_ATTEMPT: 'booking_attempt',
  BOOKING_COMPLETE: 'booking_complete',
  BOOKING_CANCEL: 'booking_cancel',
  
  // Navigation events
  ZONE_SELECTION: 'zone_selection',
  SCREEN_VIEW: 'screen_view',
  
  // Error events
  APP_ERROR: 'app_error',
  APP_CRASH: 'app_crash',
  
  // Performance events
  PERFORMANCE: 'performance',
  NETWORK_PERFORMANCE: 'network_performance',
  
  // Engagement events
  USER_ENGAGEMENT: 'user_engagement',
  FEATURE_USAGE: 'feature_usage',
  
  // Session events
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  
  // Onboarding events
  ONBOARDING_COMPLETE: 'onboarding_complete',
  TUTORIAL_COMPLETE: 'tutorial_complete',
  
  // Notification events
  NOTIFICATION_INTERACTION: 'notification_interaction',
  
  // Deep link events
  DEEP_LINK: 'deep_link',
  
  // App events
  APP_UPDATE: 'app_update',
  BATTERY_USAGE: 'battery_usage',
  MEMORY_USAGE: 'memory_usage',
} as const; 