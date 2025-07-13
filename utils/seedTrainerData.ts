import { TrainerService } from './trainerService';

// Sample trainer data for seeding Firebase
const sampleTrainers = [
  {
    name: 'Sarah Johnson',
    specialty: 'Strength Training',
    rating: 4.8,
    hourlyRate: 75,
    experience: '5 years',
    avatar: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=SJ',
    zoneId: 1,
    userId: 'sample-user-1',
  },
  {
    name: 'Mike Chen',
    specialty: 'Cardio & HIIT',
    rating: 4.9,
    hourlyRate: 80,
    experience: '7 years',
    avatar: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=MC',
    zoneId: 1,
    userId: 'sample-user-2',
  },
  {
    name: 'Emily Rodriguez',
    specialty: 'Yoga & Flexibility',
    rating: 4.7,
    hourlyRate: 60,
    experience: '4 years',
    avatar: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=ER',
    zoneId: 2,
    userId: 'sample-user-3',
  },
  {
    name: 'David Thompson',
    specialty: 'Beach Training',
    rating: 4.6,
    hourlyRate: 70,
    experience: '6 years',
    avatar: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=DT',
    zoneId: 3,
    userId: 'sample-user-4',
  },
  {
    name: 'Lisa Park',
    specialty: 'Pilates & Core',
    rating: 4.9,
    hourlyRate: 85,
    experience: '8 years',
    avatar: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=LP',
    zoneId: 2,
    userId: 'sample-user-5',
  },
  {
    name: 'James Wilson',
    specialty: 'CrossFit & Functional',
    rating: 4.5,
    hourlyRate: 65,
    experience: '3 years',
    avatar: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=JW',
    zoneId: 1,
    userId: 'sample-user-6',
  },
];

export const seedTrainerData = async () => {
  console.log('Starting to seed trainer data...');
  
  try {
    for (const trainerData of sampleTrainers) {
      const trainerId = await TrainerService.createTrainer(trainerData);
      console.log(`Created trainer: ${trainerData.name} with ID: ${trainerId}`);
    }
    
    console.log('Successfully seeded trainer data!');
    return true;
  } catch (error) {
    console.error('Error seeding trainer data:', error);
    return false;
  }
};

// Function to approve all trainers (for testing)
export const approveAllTrainers = async () => {
  console.log('Approving all trainers...');
  
  try {
    const trainers = await TrainerService.getApprovedTrainers();
    
    // Note: This would require admin privileges in a real app
    // For testing, you can manually approve trainers in Firebase Console
    console.log(`Found ${trainers.length} approved trainers`);
    
    return true;
  } catch (error) {
    console.error('Error approving trainers:', error);
    return false;
  }
};

// Function to clear all trainer data (for testing)
export const clearTrainerData = async () => {
  console.log('Clearing all trainer data...');
  
  try {
    const trainers = await TrainerService.getApprovedTrainers();
    
    for (const trainer of trainers) {
      await TrainerService.deleteTrainer(trainer.id);
      console.log(`Deleted trainer: ${trainer.name}`);
    }
    
    console.log('Successfully cleared trainer data!');
    return true;
  } catch (error) {
    console.error('Error clearing trainer data:', error);
    return false;
  }
}; 