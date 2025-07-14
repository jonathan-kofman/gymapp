// Firebase Cloud Functions
// These functions run on the server side for operations that require admin privileges

import { db } from './config';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export class FirebaseFunctions {
  
  // Approve a trainer (admin function)
  static async approveTrainer(trainerId: string): Promise<boolean> {
    try {
      const trainerRef = doc(db, 'trainers', trainerId);
      await updateDoc(trainerRef, {
        isApproved: true,
        updatedAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error approving trainer:', error);
      return false;
    }
  }

  // Reject a trainer (admin function)
  static async rejectTrainer(trainerId: string, reason?: string): Promise<boolean> {
    try {
      const trainerRef = doc(db, 'trainers', trainerId);
      await updateDoc(trainerRef, {
        isApproved: false,
        rejectionReason: reason || 'Application rejected',
        updatedAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error rejecting trainer:', error);
      return false;
    }
  }

  // Get trainer statistics (admin function)
  static async getTrainerStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  }> {
    try {
      const trainersRef = collection(db, 'trainers');
      
      // Get all trainers
      const allTrainers = await getDocs(trainersRef);
      const total = allTrainers.size;
      
      // Get approved trainers
      const approvedQuery = query(trainersRef, where('isApproved', '==', true));
      const approvedTrainers = await getDocs(approvedQuery);
      const approved = approvedTrainers.size;
      
      // Get pending trainers
      const pendingQuery = query(trainersRef, where('isApproved', '==', false));
      const pendingTrainers = await getDocs(pendingQuery);
      const pending = pendingTrainers.size;
      
      // Calculate rejected (total - approved - pending)
      const rejected = total - approved - pending;
      
      return {
        total,
        approved,
        pending,
        rejected,
      };
    } catch (error) {
      console.error('Error getting trainer stats:', error);
      return {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      };
    }
  }

  // Update trainer rating (called when new review is added)
  static async updateTrainerRating(trainerId: string): Promise<boolean> {
    try {
      const trainerRef = doc(db, 'trainers', trainerId);
      const reviewsRef = collection(db, 'reviews');
      
      // Get all reviews for this trainer
      const reviewsQuery = query(reviewsRef, where('trainerId', '==', trainerId));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      let totalRating = 0;
      let reviewCount = 0;
      
      reviewsSnapshot.forEach((doc) => {
        const review = doc.data();
        totalRating += review.rating;
        reviewCount++;
      });
      
      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
      
      // Update trainer's average rating
      await updateDoc(trainerRef, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount,
        updatedAt: new Date(),
      });
      
      return true;
    } catch (error) {
      console.error('Error updating trainer rating:', error);
      return false;
    }
  }

  // Clean up old files (admin function)
  static async cleanupOldFiles(daysOld: number = 30): Promise<number> {
    try {
      const filesRef = collection(db, 'trainerFiles');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      // Get files older than specified days
      const oldFilesQuery = query(
        filesRef,
        where('uploadDate', '<', cutoffDate)
      );
      
      const oldFilesSnapshot = await getDocs(oldFilesQuery);
      let deletedCount = 0;
      
      // Note: In a real implementation, you would also delete from Storage
      // This is just a placeholder for the Firestore cleanup
      oldFilesSnapshot.forEach(async (doc) => {
        try {
          await updateDoc(doc.ref, {
            isDeleted: true,
            deletedAt: new Date(),
          });
          deletedCount++;
        } catch (error) {
          console.error('Error marking file as deleted:', error);
        }
      });
      
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old files:', error);
      return 0;
    }
  }

  // Send notification to trainer (placeholder for push notifications)
  static async sendTrainerNotification(
    trainerId: string,
    title: string,
    message: string,
    type: 'booking' | 'review' | 'file' | 'system' = 'system'
  ): Promise<boolean> {
    try {
      // In a real implementation, this would send push notifications
      // For now, we'll just log the notification
      console.log(`Notification to trainer ${trainerId}:`, {
        title,
        message,
        type,
        timestamp: new Date(),
      });
      
      // You could integrate with Firebase Cloud Messaging here
      // or use a service like OneSignal for push notifications
      
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
} 