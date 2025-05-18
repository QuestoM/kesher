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

// Calculate the user's risk level based on recent check-ins and sleep data
export const calculateRiskLevel = (state: HealthState): RiskLevel => {
  let score = 0; // 0=low,1=moderate,2=elevated,3=high

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedCheckIns = [...state.checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedCheckIns.length > 0) {
    const lastDate = new Date(sortedCheckIns[0].date);
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 3) {
      return 'high';
    }

    if (diffDays > 1) {
      score += 1;
    }

    let negativeStreak = 0;
    for (const checkIn of sortedCheckIns) {
      if (checkIn.mood === 'bad' || checkIn.mood === 'notGood') {
        negativeStreak += 1;
      } else {
        break;
      }
    }

    if (negativeStreak >= 5) {
      return 'high';
    } else if (negativeStreak >= 3) {
      score += 2;
    } else if (negativeStreak >= 1) {
      score += 1;
    }
  }

  const sortedSleep = [...state.sleepData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recentSleep = sortedSleep.slice(0, 3);
  let poorSleepCount = 0;
  for (const sleep of recentSleep) {
    if (sleep.hoursSlept < 4 || sleep.quality === 'poor') {
      poorSleepCount += 1;
    }
  }

  if (poorSleepCount >= 3) {
    score += 2;
  } else if (poorSleepCount >= 1) {
    score += 1;
  }

  if (score >= 3) return 'high';
  if (score === 2) return 'elevated';
  if (score === 1) return 'moderate';
  return 'low';
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

      state.riskLevel = calculateRiskLevel(state);
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

      state.riskLevel = calculateRiskLevel(state);
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