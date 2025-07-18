import { Trainer } from '../types';

// Mock trainer data
const mockTrainers: Trainer[] = [
  {
    id: '1',
    name: 'John Smith',
    specialty: 'Strength Training',
    rating: 4.8,
    hourlyRate: 75,
    experience: '8 years',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
    zoneId: 1,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    specialty: 'Yoga & Flexibility',
    rating: 4.9,
    hourlyRate: 65,
    experience: '5 years',
    avatar: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=150&h=150&fit=crop&crop=face',
    zoneId: 1,
  },
  {
    id: '3',
    name: 'Mike Davis',
    specialty: 'Cardio & HIIT',
    rating: 4.7,
    hourlyRate: 70,
    experience: '6 years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    zoneId: 2,
  },
  {
    id: '4',
    name: 'Lisa Chen',
    specialty: 'Weight Loss',
    rating: 4.6,
    hourlyRate: 60,
    experience: '4 years',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    zoneId: 2,
  },
  {
    id: '5',
    name: 'David Wilson',
    specialty: 'CrossFit',
    rating: 4.8,
    hourlyRate: 80,
    experience: '7 years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    zoneId: 3,
  },
];

export class TrainerService {
  static async getApprovedTrainers(): Promise<Trainer[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTrainers;
  }

  static async getTrainersByZone(zoneId: number): Promise<Trainer[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTrainers.filter(trainer => trainer.zoneId === zoneId);
  }

  static async getTrainerById(trainerId: string): Promise<Trainer | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTrainers.find(trainer => trainer.id === trainerId) || null;
  }

  static async searchTrainers(searchTerm: string): Promise<Trainer[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const term = searchTerm.toLowerCase();
    return mockTrainers.filter(trainer => 
      trainer.name.toLowerCase().includes(term) ||
      trainer.specialty.toLowerCase().includes(term)
    );
  }

  static async createTrainer(trainerData: Omit<Trainer, 'id'>): Promise<Trainer> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const newTrainer: Trainer = {
      ...trainerData,
      id: `trainer_${Date.now()}`,
    };
    mockTrainers.push(newTrainer);
    return newTrainer;
  }

  static async updateTrainer(trainerId: string, updates: Partial<Trainer>): Promise<Trainer | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockTrainers.findIndex(trainer => trainer.id === trainerId);
    if (index === -1) return null;
    
    mockTrainers[index] = { ...mockTrainers[index], ...updates };
    return mockTrainers[index];
  }

  static async deleteTrainer(trainerId: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTrainers.findIndex(trainer => trainer.id === trainerId);
    if (index === -1) return false;
    
    mockTrainers.splice(index, 1);
    return true;
  }
} 