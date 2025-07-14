// Firebase Crashlytics Utility
// Track crashes and errors for debugging

import { getCrashlytics, log, recordError, setUserId, setAttribute } from 'firebase/crashlytics';
import { app } from '../firebase/config';

// Initialize Crashlytics
const crashlytics = getCrashlytics(app);

export class Crashlytics {
  
  // Log a message to Crashlytics
  static log(message: string): void {
    try {
      log(crashlytics, message);
    } catch (error) {
      console.error('Crashlytics log error:', error);
    }
  }

  // Record an error
  static recordError(error: Error, context?: Record<string, any>): void {
    try {
      recordError(crashlytics, error);
      
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          setAttribute(crashlytics, key, value.toString());
        });
      }
    } catch (crashlyticsError) {
      console.error('Crashlytics record error:', crashlyticsError);
    }
  }

  // Set user ID for crash reports
  static setUserId(userId: string): void {
    try {
      setUserId(crashlytics, userId);
    } catch (error) {
      console.error('Crashlytics set user ID error:', error);
    }
  }

  // Set custom attributes
  static setAttribute(key: string, value: string): void {
    try {
      setAttribute(crashlytics, key, value);
    } catch (error) {
      console.error('Crashlytics set attribute error:', error);
    }
  }

  // Set multiple attributes at once
  static setAttributes(attributes: Record<string, string>): void {
    try {
      Object.entries(attributes).forEach(([key, value]) => {
        setAttribute(crashlytics, key, value);
      });
    } catch (error) {
      console.error('Crashlytics set attributes error:', error);
    }
  }

  // Log Firebase operation errors
  static logFirebaseError(operation: string, error: any, context?: Record<string, any>): void {
    const errorInfo = {
      operation,
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
      context: context || {},
    };
    
    this.log(`Firebase ${operation} error: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Firebase ${operation} failed`), errorInfo);
  }

  // Log authentication errors
  static logAuthError(method: string, error: any): void {
    const errorInfo = {
      authMethod: method,
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
    };
    
    this.log(`Authentication error (${method}): ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Authentication failed: ${method}`), errorInfo);
  }

  // Log file operation errors
  static logFileError(operation: string, error: any, fileInfo?: Record<string, any>): void {
    const errorInfo = {
      fileOperation: operation,
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
      fileInfo: fileInfo || {},
    };
    
    this.log(`File ${operation} error: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`File operation failed: ${operation}`), errorInfo);
  }

  // Log network errors
  static logNetworkError(url: string, error: any, method?: string): void {
    const errorInfo = {
      url,
      method: method || 'GET',
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
    };
    
    this.log(`Network error (${method || 'GET'} ${url}): ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Network request failed: ${url}`), errorInfo);
  }

  // Log performance issues
  static logPerformanceIssue(metric: string, value: number, threshold: number): void {
    const issueInfo = {
      metric,
      value,
      threshold,
      severity: value > threshold * 2 ? 'critical' : 'warning',
    };
    
    this.log(`Performance issue: ${JSON.stringify(issueInfo)}`);
    this.setAttribute('performance_issue', `${metric}:${value}:${threshold}`);
  }

  // Log app state changes
  static logAppStateChange(state: string, context?: Record<string, any>): void {
    const stateInfo = {
      state,
      timestamp: new Date().toISOString(),
      context: context || {},
    };
    
    this.log(`App state change: ${JSON.stringify(stateInfo)}`);
    this.setAttribute('app_state', state);
  }

  // Log user actions
  static logUserAction(action: string, target?: string, value?: any): void {
    const actionInfo = {
      action,
      target: target || 'unknown',
      value: value || null,
      timestamp: new Date().toISOString(),
    };
    
    this.log(`User action: ${JSON.stringify(actionInfo)}`);
    this.setAttribute('last_user_action', action);
  }

  // Log configuration issues
  static logConfigIssue(issue: string, details?: Record<string, any>): void {
    const issueInfo = {
      issue,
      details: details || {},
      timestamp: new Date().toISOString(),
    };
    
    this.log(`Configuration issue: ${JSON.stringify(issueInfo)}`);
    this.recordError(new Error(`Configuration issue: ${issue}`), issueInfo);
  }

  // Log memory issues
  static logMemoryIssue(usedMemory: number, totalMemory: number, threshold: number): void {
    const memoryInfo = {
      usedMemory,
      totalMemory,
      usagePercent: (usedMemory / totalMemory) * 100,
      threshold,
      severity: (usedMemory / totalMemory) > threshold ? 'critical' : 'warning',
    };
    
    this.log(`Memory issue: ${JSON.stringify(memoryInfo)}`);
    this.setAttribute('memory_usage_percent', memoryInfo.usagePercent.toString());
  }

  // Log battery issues
  static logBatteryIssue(level: number, isCharging: boolean): void {
    const batteryInfo = {
      level,
      isCharging,
      severity: level < 10 ? 'critical' : level < 20 ? 'warning' : 'normal',
    };
    
    this.log(`Battery issue: ${JSON.stringify(batteryInfo)}`);
    this.setAttribute('battery_level', level.toString());
  }

  // Log database errors
  static logDatabaseError(operation: string, collection: string, error: any): void {
    const errorInfo = {
      operation,
      collection,
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
    };
    
    this.log(`Database error: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Database operation failed: ${operation}`), errorInfo);
  }

  // Log storage errors
  static logStorageError(operation: string, path: string, error: any): void {
    const errorInfo = {
      operation,
      path,
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
    };
    
    this.log(`Storage error: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Storage operation failed: ${operation}`), errorInfo);
  }

  // Log UI errors
  static logUIError(component: string, error: any, context?: Record<string, any>): void {
    const errorInfo = {
      component,
      errorMessage: error?.message || 'No message',
      context: context || {},
    };
    
    this.log(`UI error in ${component}: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`UI error in ${component}`), errorInfo);
  }

  // Log navigation errors
  static logNavigationError(from: string, to: string, error: any): void {
    const errorInfo = {
      from,
      to,
      errorMessage: error?.message || 'No message',
    };
    
    this.log(`Navigation error: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Navigation failed: ${from} -> ${to}`), errorInfo);
  }

  // Log permission errors
  static logPermissionError(resource: string, action: string, error: any): void {
    const errorInfo = {
      resource,
      action,
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
    };
    
    this.log(`Permission error: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Permission denied: ${action} on ${resource}`), errorInfo);
  }

  // Log app startup issues
  static logStartupIssue(issue: string, details?: Record<string, any>): void {
    const issueInfo = {
      issue,
      details: details || {},
      timestamp: new Date().toISOString(),
    };
    
    this.log(`Startup issue: ${JSON.stringify(issueInfo)}`);
    this.recordError(new Error(`Startup issue: ${issue}`), issueInfo);
  }

  // Log session issues
  static logSessionIssue(issue: string, sessionData?: Record<string, any>): void {
    const issueInfo = {
      issue,
      sessionData: sessionData || {},
      timestamp: new Date().toISOString(),
    };
    
    this.log(`Session issue: ${JSON.stringify(issueInfo)}`);
    this.recordError(new Error(`Session issue: ${issue}`), issueInfo);
  }

  // Log data sync issues
  static logSyncIssue(dataType: string, error: any, context?: Record<string, any>): void {
    const errorInfo = {
      dataType,
      errorCode: error?.code || 'unknown',
      errorMessage: error?.message || 'No message',
      context: context || {},
    };
    
    this.log(`Sync issue for ${dataType}: ${JSON.stringify(errorInfo)}`);
    this.recordError(new Error(`Sync failed for ${dataType}`), errorInfo);
  }
}

// Crashlytics configuration
export const CRASHLYTICS_CONFIG = {
  // Enable/disable crash reporting
  enabled: true,
  
  // Enable/disable automatic crash collection
  automaticDataCollectionEnabled: true,
  
  // Custom keys for crash reports
  customKeys: {
    app_version: '1.0.0',
    platform: 'react-native',
    environment: 'development',
  },
} as const; 