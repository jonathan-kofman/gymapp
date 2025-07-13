import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Trainer } from '../types';

export interface FirebaseTrainer extends Omit<Trainer, 'id'> {
  id: string;
  userId: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TrainerService {
  private static COLLECTION_NAME = 'trainers';

  // Get all approved trainers
  static async getApprovedTrainers(): Promise<Trainer[]> {
    try {
      const trainersQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(trainersQuery);
      const trainers: Trainer[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseTrainer;
        trainers.push({
          id: doc.id,
          name: data.name,
          specialty: data.specialty,
          rating: data.rating,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          avatar: data.avatar,
          zoneId: data.zoneId,
        });
      });
      
      return trainers;
    } catch (error) {
      console.error('Error getting approved trainers:', error);
      throw error;
    }
  }

  // Get trainers by zone
  static async getTrainersByZone(zoneId: number): Promise<Trainer[]> {
    try {
      const trainersQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('isApproved', '==', true),
        where('zoneId', '==', zoneId),
        orderBy('rating', 'desc')
      );
      
      const querySnapshot = await getDocs(trainersQuery);
      const trainers: Trainer[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseTrainer;
        trainers.push({
          id: doc.id,
          name: data.name,
          specialty: data.specialty,
          rating: data.rating,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          avatar: data.avatar,
          zoneId: data.zoneId,
        });
      });
      
      return trainers;
    } catch (error) {
      console.error('Error getting trainers by zone:', error);
      throw error;
    }
  }

  // Get a specific trainer by ID
  static async getTrainerById(trainerId: string): Promise<Trainer | null> {
    try {
      const trainerDoc = await getDoc(doc(db, this.COLLECTION_NAME, trainerId));
      
      if (trainerDoc.exists()) {
        const data = trainerDoc.data() as FirebaseTrainer;
        return {
          id: trainerDoc.id,
          name: data.name,
          specialty: data.specialty,
          rating: data.rating,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          avatar: data.avatar,
          zoneId: data.zoneId,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting trainer by ID:', error);
      throw error;
    }
  }

  // Create a new trainer profile
  static async createTrainer(trainerData: Omit<FirebaseTrainer, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>): Promise<string> {
    try {
      const now = new Date();
      const trainerDoc = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...trainerData,
        isApproved: false, // New trainers need approval
        createdAt: now,
        updatedAt: now,
      });
      
      return trainerDoc.id;
    } catch (error) {
      console.error('Error creating trainer:', error);
      throw error;
    }
  }

  // Update trainer profile
  static async updateTrainer(trainerId: string, updates: Partial<FirebaseTrainer>): Promise<void> {
    try {
      const trainerRef = doc(db, this.COLLECTION_NAME, trainerId);
      await updateDoc(trainerRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  }

  // Delete trainer profile
  static async deleteTrainer(trainerId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, trainerId));
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  }

  // Search trainers by name or specialty
  static async searchTrainers(searchTerm: string): Promise<Trainer[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation - consider using Algolia or similar for better search
      const trainersQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('isApproved', '==', true),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(trainersQuery);
      const trainers: Trainer[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseTrainer;
        const trainer = {
          id: doc.id,
          name: data.name,
          specialty: data.specialty,
          rating: data.rating,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          avatar: data.avatar,
          zoneId: data.zoneId,
        };
        
        // Simple client-side filtering
        if (trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase())) {
          trainers.push(trainer);
        }
      });
      
      return trainers;
    } catch (error) {
      console.error('Error searching trainers:', error);
      throw error;
    }
  }

  // Get trainers with pagination
  static async getTrainersWithPagination(
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ trainers: Trainer[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      let trainersQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        trainersQuery = query(
          collection(db, this.COLLECTION_NAME),
          where('isApproved', '==', true),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }
      
      const querySnapshot = await getDocs(trainersQuery);
      const trainers: Trainer[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseTrainer;
        trainers.push({
          id: doc.id,
          name: data.name,
          specialty: data.specialty,
          rating: data.rating,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          avatar: data.avatar,
          zoneId: data.zoneId,
        });
      });
      
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      
      return {
        trainers,
        lastDoc: lastVisible,
      };
    } catch (error) {
      console.error('Error getting trainers with pagination:', error);
      throw error;
    }
  }
} 