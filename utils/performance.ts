// Firebase Performance Monitoring Utility
// Track app performance and network requests

import { getPerformance, trace, Performance } from 'firebase/performance';
import { app } from '../firebase/config';

// Initialize Performance Monitoring
const perf = getPerformance(app);

export class PerformanceMonitor {
  
  // Create a custom trace
  static createTrace(traceName: string): Performance.Trace {
    return trace(perf, traceName);
  }

  // Track Firebase operation performance
  static async trackFirebaseOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace(`firebase_${operationName}`);
    
    try {
      trace.start();
      const result = await operation();
      trace.stop();
      return result;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track file upload performance
  static async trackFileUpload(
    fileSize: number,
    fileType: string,
    uploadOperation: () => Promise<string>
  ): Promise<string> {
    const trace = this.createTrace('file_upload');
    
    try {
      trace.putMetric('file_size_bytes', fileSize);
      trace.putAttribute('file_type', fileType);
      
      trace.start();
      const downloadUrl = await uploadOperation();
      trace.stop();
      
      return downloadUrl;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track API request performance
  static async trackApiRequest<T>(
    url: string,
    method: string,
    request: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace('api_request');
    
    try {
      trace.putAttribute('url', url);
      trace.putAttribute('method', method);
      
      trace.start();
      const response = await request();
      trace.stop();
      
      return response;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track screen load performance
  static trackScreenLoad(screenName: string, loadTime: number): void {
    const trace = this.createTrace('screen_load');
    trace.putAttribute('screen_name', screenName);
    trace.putMetric('load_time_ms', loadTime);
    trace.stop();
  }

  // Track database query performance
  static async trackDatabaseQuery<T>(
    collectionName: string,
    query: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace('database_query');
    
    try {
      trace.putAttribute('collection', collectionName);
      
      trace.start();
      const result = await query();
      trace.stop();
      
      return result;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track image load performance
  static trackImageLoad(imageUrl: string, loadTime: number, success: boolean): void {
    const trace = this.createTrace('image_load');
    trace.putAttribute('image_url', imageUrl);
    trace.putMetric('load_time_ms', loadTime);
    trace.putAttribute('success', success.toString());
    trace.stop();
  }

  // Track app startup performance
  static trackAppStartup(startupTime: number): void {
    const trace = this.createTrace('app_startup');
    trace.putMetric('startup_time_ms', startupTime);
    trace.stop();
  }

  // Track memory usage
  static trackMemoryUsage(usedMemory: number, totalMemory: number): void {
    const trace = this.createTrace('memory_usage');
    trace.putMetric('used_memory_mb', usedMemory);
    trace.putMetric('total_memory_mb', totalMemory);
    trace.putMetric('memory_usage_percent', (usedMemory / totalMemory) * 100);
    trace.stop();
  }

  // Track battery usage
  static trackBatteryUsage(level: number, isCharging: boolean): void {
    const trace = this.createTrace('battery_usage');
    trace.putMetric('battery_level_percent', level);
    trace.putAttribute('is_charging', isCharging.toString());
    trace.stop();
  }

  // Track network performance
  static trackNetworkPerformance(
    url: string,
    duration: number,
    statusCode: number,
    responseSize: number
  ): void {
    const trace = this.createTrace('network_request');
    trace.putAttribute('url', url);
    trace.putMetric('duration_ms', duration);
    trace.putMetric('status_code', statusCode);
    trace.putMetric('response_size_bytes', responseSize);
    trace.stop();
  }

  // Track user interaction performance
  static trackUserInteraction(
    interactionType: string,
    target: string,
    responseTime: number
  ): void {
    const trace = this.createTrace('user_interaction');
    trace.putAttribute('interaction_type', interactionType);
    trace.putAttribute('target', target);
    trace.putMetric('response_time_ms', responseTime);
    trace.stop();
  }

  // Track search performance
  static async trackSearchPerformance<T>(
    searchTerm: string,
    searchOperation: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace('search_performance');
    
    try {
      trace.putAttribute('search_term', searchTerm);
      
      trace.start();
      const results = await searchOperation();
      trace.stop();
      
      // Add result count if it's an array
      if (Array.isArray(results)) {
        trace.putMetric('results_count', results.length);
      }
      
      return results;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track file processing performance
  static async trackFileProcessing<T>(
    fileType: string,
    fileSize: number,
    processingOperation: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace('file_processing');
    
    try {
      trace.putAttribute('file_type', fileType);
      trace.putMetric('file_size_bytes', fileSize);
      
      trace.start();
      const result = await processingOperation();
      trace.stop();
      
      return result;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track authentication performance
  static async trackAuthPerformance<T>(
    authMethod: string,
    authOperation: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace('auth_performance');
    
    try {
      trace.putAttribute('auth_method', authMethod);
      
      trace.start();
      const result = await authOperation();
      trace.stop();
      
      return result;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track offline sync performance
  static async trackOfflineSync<T>(
    syncOperation: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace('offline_sync');
    
    try {
      trace.start();
      const result = await syncOperation();
      trace.stop();
      
      return result;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }

  // Track cache performance
  static trackCachePerformance(
    cacheType: string,
    hit: boolean,
    responseTime: number
  ): void {
    const trace = this.createTrace('cache_performance');
    trace.putAttribute('cache_type', cacheType);
    trace.putAttribute('cache_hit', hit.toString());
    trace.putMetric('response_time_ms', responseTime);
    trace.stop();
  }

  // Track error performance impact
  static trackErrorPerformance(
    errorType: string,
    errorContext: string,
    impactTime: number
  ): void {
    const trace = this.createTrace('error_performance');
    trace.putAttribute('error_type', errorType);
    trace.putAttribute('error_context', errorContext);
    trace.putMetric('impact_time_ms', impactTime);
    trace.stop();
  }

  // Track UI rendering performance
  static trackUIRendering(
    componentName: string,
    renderTime: number,
    complexity: number
  ): void {
    const trace = this.createTrace('ui_rendering');
    trace.putAttribute('component_name', componentName);
    trace.putMetric('render_time_ms', renderTime);
    trace.putMetric('complexity_score', complexity);
    trace.stop();
  }

  // Track data synchronization performance
  static async trackDataSync<T>(
    dataType: string,
    syncOperation: () => Promise<T>
  ): Promise<T> {
    const trace = this.createTrace('data_sync');
    
    try {
      trace.putAttribute('data_type', dataType);
      
      trace.start();
      const result = await syncOperation();
      trace.stop();
      
      return result;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }
}

// Performance constants
export const PERFORMANCE_THRESHOLDS = {
  // Time thresholds in milliseconds
  SLOW_OPERATION: 3000,
  VERY_SLOW_OPERATION: 10000,
  
  // Memory thresholds in MB
  HIGH_MEMORY_USAGE: 100,
  CRITICAL_MEMORY_USAGE: 200,
  
  // Battery thresholds
  LOW_BATTERY: 20,
  CRITICAL_BATTERY: 10,
  
  // Network thresholds
  SLOW_NETWORK: 5000,
  VERY_SLOW_NETWORK: 15000,
} as const;

// Performance monitoring configuration
export const PERFORMANCE_CONFIG = {
  // Enable/disable performance monitoring
  enabled: true,
  
  // Sampling rate (0.0 to 1.0)
  samplingRate: 1.0,
  
  // Maximum trace duration (in milliseconds)
  maxTraceDuration: 30000,
  
  // Performance thresholds
  thresholds: PERFORMANCE_THRESHOLDS,
} as const; 