import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { storage, db } from '../firebase/config';

export interface TrainerFile {
  id: string;
  trainerId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadDate: Date;
  description?: string;
}

export class TrainerFileService {
  // Upload a file for a trainer
  static async uploadTrainerFile(
    trainerId: string,
    file: File | Blob,
    fileName: string,
    description?: string
  ): Promise<TrainerFile> {
    try {
      // Create a unique file path
      const fileId = `${trainerId}_${Date.now()}_${fileName}`;
      const storageRef = ref(storage, `trainers/${trainerId}/files/${fileId}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Create file metadata
      const fileData: TrainerFile = {
        id: fileId,
        trainerId,
        fileName,
        fileUrl: downloadURL,
        fileType: file.type || 'application/octet-stream',
        uploadDate: new Date(),
        description
      };
      
      // Save file metadata to Firestore
      const fileDocRef = doc(db, 'trainerFiles', fileId);
      await setDoc(fileDocRef, fileData);
      
      return fileData;
    } catch (error) {
      console.error('Error uploading trainer file:', error);
      throw error;
    }
  }

  // Get all files for a trainer
  static async getTrainerFiles(trainerId: string): Promise<TrainerFile[]> {
    try {
      const filesQuery = query(
        collection(db, 'trainerFiles'),
        where('trainerId', '==', trainerId)
      );
      
      const querySnapshot = await getDocs(filesQuery);
      const files: TrainerFile[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        files.push({
          ...data,
          uploadDate: data.uploadDate.toDate()
        } as TrainerFile);
      });
      
      return files.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    } catch (error) {
      console.error('Error getting trainer files:', error);
      throw error;
    }
  }

  // Get a specific file by ID
  static async getTrainerFile(fileId: string): Promise<TrainerFile | null> {
    try {
      const fileDocRef = doc(db, 'trainerFiles', fileId);
      const fileDoc = await getDoc(fileDocRef);
      
      if (fileDoc.exists()) {
        const data = fileDoc.data();
        return {
          ...data,
          uploadDate: data.uploadDate.toDate()
        } as TrainerFile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting trainer file:', error);
      throw error;
    }
  }

  // Delete a trainer file
  static async deleteTrainerFile(fileId: string, trainerId: string): Promise<void> {
    try {
      // Get file metadata first
      const fileData = await this.getTrainerFile(fileId);
      if (!fileData) {
        throw new Error('File not found');
      }
      
      // Delete from Storage
      const storageRef = ref(storage, `trainers/${trainerId}/files/${fileId}`);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      const fileDocRef = doc(db, 'trainerFiles', fileId);
      await deleteObject(fileDocRef);
    } catch (error) {
      console.error('Error deleting trainer file:', error);
      throw error;
    }
  }

  // Update file metadata
  static async updateTrainerFile(
    fileId: string,
    updates: Partial<Pick<TrainerFile, 'fileName' | 'description'>>
  ): Promise<void> {
    try {
      const fileDocRef = doc(db, 'trainerFiles', fileId);
      await updateDoc(fileDocRef, updates);
    } catch (error) {
      console.error('Error updating trainer file:', error);
      throw error;
    }
  }
} 