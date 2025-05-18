import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Sleep data interface
interface SleepData {
  date: string;
  hoursSlept: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent' | null;
  deepSleepMinutes: number;
  remSleepMinutes: number;
  lightSleepMinutes: number;
  wakePeriods: number;
}

// Steps data interface
interface StepsData {
  date: string;
  count: number;
  goal: number;
}

// Check-in interface
export type MoodType = 'great' | 'good' | 'okay' | 'notGood' | 'bad';

interface CheckIn {
  date: string;
  timestamp: number;
  mood: MoodType;
  note?: string;
}

// Risk level type
export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high' | null;

// Health state interface
interface HealthState {
  sleepData: SleepData[];
  stepsData: StepsData[];
  checkIns: CheckIn[];
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  riskLevel: RiskLevel;
  healthPermissionGranted: boolean;
}

// Define initial state
const initialState: HealthState = {
  sleepData: [],
  stepsData: [],
  checkIns: [],
  currentStreak: 0,
  longestStreak: 0,
  lastCheckInDate: null,
  riskLevel: null,
  healthPermissionGranted: false,
};

// Calculate streak based on consecutive check-ins
const calculateStreak = (checkIns: CheckIn[], currentStreak: number): number => {
  if (checkIns.length === 0) return 0;
  
  // Sort check-ins by date (most recent first)
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const mostRecentDate = new Date(sortedCheckIns[0].date);
  mostRecentDate.setHours(0, 0, 0, 0);
  
  // If most recent check-in is today, maintain or increment streak
  if (mostRecentDate.getTime() === today.getTime()) {
    return currentStreak + 1;
  }
  
  // If most recent check-in was yesterday, maintain streak
  if (mostRecentDate.getTime() === yesterday.getTime()) {
    return currentStreak;
  }
  
  // Otherwise, streak is broken
  return 0;
};

// Create health slice
const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    addSleepData: (state, action: PayloadAction<SleepData>) => {
      // Check if we already have data for this date and replace it
      const existingIndex = state.sleepData.findIndex(
        (item) => item.date === action.payload.date
      );
      
      if (existingIndex !== -1) {
        state.sleepData[existingIndex] = action.payload;
      } else {
        state.sleepData.push(action.payload);
      }
    },
    
    addStepsData: (state, action: PayloadAction<StepsData>) => {
      const existingIndex = state.stepsData.findIndex(
        (item) => item.date === action.payload.date
      );
      
      if (existingIndex !== -1) {
        state.stepsData[existingIndex] = action.payload;
      } else {
        state.stepsData.push(action.payload);
      }
    },
    
    addCheckIn: (state, action: PayloadAction<Omit<CheckIn, 'timestamp'>>) => {
      const newCheckIn: CheckIn = {
        ...action.payload,
        timestamp: Date.now(),
      };
      
      state.checkIns.push(newCheckIn);
      state.lastCheckInDate = newCheckIn.date;
      
      // Calculate streak
      state.currentStreak = calculateStreak(state.checkIns, state.currentStreak);
      
      // Update longest streak if needed
      if (state.currentStreak > state.longestStreak) {
        state.longestStreak = state.currentStreak;
      }
    },
    
    setRiskLevel: (state, action: PayloadAction<RiskLevel>) => {
      state.riskLevel = action.payload;
    },
    
    setHealthPermission: (state, action: PayloadAction<boolean>) => {
      state.healthPermissionGranted = action.payload;
    },
    
    clearHealthData: () => initialState,
  },
});

// Export actions
export const {
  addSleepData,
  addStepsData,
  addCheckIn,
  setRiskLevel,
  setHealthPermission,
  clearHealthData,
} = healthSlice.actions;

// Export reducer
export default healthSlice.reducer; 