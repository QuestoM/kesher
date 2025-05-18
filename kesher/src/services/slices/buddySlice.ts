import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Buddy status type
export type BuddyStatus = 'online' | 'offline' | 'busy';

// Buddy interface
export interface Buddy {
  id: string;
  name: string;
  phoneNumber: string;
  status: BuddyStatus;
  lastActive: string; // ISO date string
  isPrimary: boolean;
  avatarUrl?: string;
}

// Alert interface
export interface BuddyAlert {
  id: string;
  buddyId: string;
  timestamp: number;
  message: string;
  isRead: boolean;
  responded: boolean;
  responseType?: 'accepted' | 'declined';
}

// Message interface
export interface BuddyMessage {
  id: string;
  buddyId: string;
  senderId: string;
  timestamp: number;
  text: string;
  isRead: boolean;
}

// Buddy state interface
interface BuddyState {
  buddies: Buddy[];
  pendingInvites: string[]; // IDs of pending buddy invites
  alerts: BuddyAlert[];
  messages: BuddyMessage[];
  isOnline: boolean;
  currentStatus: BuddyStatus;
  selectedBuddyId: string | null;
}

// Initial state
const initialState: BuddyState = {
  buddies: [],
  pendingInvites: [],
  alerts: [],
  messages: [],
  isOnline: false,
  currentStatus: 'offline',
  selectedBuddyId: null,
};

// Create buddy slice
const buddySlice = createSlice({
  name: 'buddy',
  initialState,
  reducers: {
    addBuddy: (state, action: PayloadAction<Buddy>) => {
      // Check if buddy already exists
      const existingIndex = state.buddies.findIndex(
        (buddy) => buddy.id === action.payload.id
      );
      
      if (existingIndex !== -1) {
        state.buddies[existingIndex] = action.payload;
      } else {
        state.buddies.push(action.payload);
      }
      
      // Remove from pending invites if present
      state.pendingInvites = state.pendingInvites.filter(
        (id) => id !== action.payload.id
      );
    },
    
    removeBuddy: (state, action: PayloadAction<string>) => {
      state.buddies = state.buddies.filter(
        (buddy) => buddy.id !== action.payload
      );
    },
    
    updateBuddyStatus: (state, action: PayloadAction<{id: string; status: BuddyStatus}>) => {
      const buddyIndex = state.buddies.findIndex(
        (buddy) => buddy.id === action.payload.id
      );
      
      if (buddyIndex !== -1) {
        state.buddies[buddyIndex].status = action.payload.status;
        state.buddies[buddyIndex].lastActive = new Date().toISOString();
      }
    },
    
    setCurrentStatus: (state, action: PayloadAction<BuddyStatus>) => {
      state.currentStatus = action.payload;
      state.isOnline = action.payload !== 'offline';
    },
    
    addAlert: (state, action: PayloadAction<Omit<BuddyAlert, 'timestamp' | 'isRead' | 'responded'>>) => {
      const newAlert: BuddyAlert = {
        ...action.payload,
        timestamp: Date.now(),
        isRead: false,
        responded: false,
      };
      
      state.alerts.push(newAlert);
    },
    
    markAlertAsRead: (state, action: PayloadAction<string>) => {
      const alertIndex = state.alerts.findIndex(
        (alert) => alert.id === action.payload
      );
      
      if (alertIndex !== -1) {
        state.alerts[alertIndex].isRead = true;
      }
    },
    
    respondToAlert: (state, action: PayloadAction<{id: string; responseType: 'accepted' | 'declined'}>) => {
      const alertIndex = state.alerts.findIndex(
        (alert) => alert.id === action.payload.id
      );
      
      if (alertIndex !== -1) {
        state.alerts[alertIndex].responded = true;
        state.alerts[alertIndex].responseType = action.payload.responseType;
      }
    },
    
    addMessage: (state, action: PayloadAction<Omit<BuddyMessage, 'timestamp' | 'isRead'>>) => {
      const newMessage: BuddyMessage = {
        ...action.payload,
        timestamp: Date.now(),
        isRead: false,
      };
      
      state.messages.push(newMessage);
    },
    
    markMessageAsRead: (state, action: PayloadAction<string>) => {
      const messageIndex = state.messages.findIndex(
        (message) => message.id === action.payload
      );
      
      if (messageIndex !== -1) {
        state.messages[messageIndex].isRead = true;
      }
    },
    
    addPendingInvite: (state, action: PayloadAction<string>) => {
      if (!state.pendingInvites.includes(action.payload)) {
        state.pendingInvites.push(action.payload);
      }
    },
    
    removePendingInvite: (state, action: PayloadAction<string>) => {
      state.pendingInvites = state.pendingInvites.filter(
        (id) => id !== action.payload
      );
    },
    
    setSelectedBuddy: (state, action: PayloadAction<string | null>) => {
      state.selectedBuddyId = action.payload;
    },
    
    clearBuddyData: () => initialState,
  },
});

// Export actions
export const {
  addBuddy,
  removeBuddy,
  updateBuddyStatus,
  setCurrentStatus,
  addAlert,
  markAlertAsRead,
  respondToAlert,
  addMessage,
  markMessageAsRead,
  addPendingInvite,
  removePendingInvite,
  setSelectedBuddy,
  clearBuddyData,
} = buddySlice.actions;

// Export reducer
export default buddySlice.reducer; 