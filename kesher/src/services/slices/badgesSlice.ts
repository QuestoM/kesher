import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Badge type
export type BadgeType = 
  | 'sleepStreak'
  | 'checkInStreak'
  | 'supportiveBuddy'
  | 'reflexMaster'
  | 'morningPerson'
  | 'initiator'
  | 'consistentSchedule'
  | 'socialButterfly';

// Badge level
export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

// Badge interface
export interface Badge {
  id: string;
  type: BadgeType;
  level: BadgeLevel;
  title: string;
  description: string;
  iconName: string;
  earnedAt: number;
  displayed: boolean;
}

// Badges state interface
interface BadgesState {
  earnedBadges: Badge[];
  xpPoints: number;
  level: number;
  reflexAICompletedSimulations: number[];
  hasNewBadge: boolean;
}

// Initial state
const initialState: BadgesState = {
  earnedBadges: [],
  xpPoints: 0,
  level: 1,
  reflexAICompletedSimulations: [],
  hasNewBadge: false,
};

// Calculate level based on XP
const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2100) return 6;
  if (xp < 2800) return 7;
  if (xp < 3600) return 8;
  if (xp < 4500) return 9;
  return 10;
};

// Create badges slice
const badgesSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    addBadge: (state, action: PayloadAction<Omit<Badge, 'earnedAt' | 'displayed'>>) => {
      // Check if badge already exists
      const existingBadge = state.earnedBadges.find(
        (badge) => badge.id === action.payload.id
      );
      
      if (!existingBadge) {
        const newBadge: Badge = {
          ...action.payload,
          earnedAt: Date.now(),
          displayed: false,
        };
        
        state.earnedBadges.push(newBadge);
        state.hasNewBadge = true;
      }
    },
    
    markBadgeAsDisplayed: (state, action: PayloadAction<string>) => {
      const badgeIndex = state.earnedBadges.findIndex(
        (badge) => badge.id === action.payload
      );
      
      if (badgeIndex !== -1) {
        state.earnedBadges[badgeIndex].displayed = true;
      }
      
      // Update hasNewBadge flag
      state.hasNewBadge = state.earnedBadges.some(badge => !badge.displayed);
    },
    
    addXP: (state, action: PayloadAction<number>) => {
      state.xpPoints += action.payload;
      state.level = calculateLevel(state.xpPoints);
    },
    
    addCompletedSimulation: (state, action: PayloadAction<number>) => {
      if (!state.reflexAICompletedSimulations.includes(action.payload)) {
        state.reflexAICompletedSimulations.push(action.payload);
      }
    },
    
    clearAllBadges: () => initialState,
  },
});

// Export actions
export const {
  addBadge,
  markBadgeAsDisplayed,
  addXP,
  addCompletedSimulation,
  clearAllBadges,
} = badgesSlice.actions;

// Export reducer
export default badgesSlice.reducer; 