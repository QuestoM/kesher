import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Notification type
export type NotificationType = 
  | 'checkIn' 
  | 'buddySupport' 
  | 'sleepAlert' 
  | 'systemMessage' 
  | 'achievement';

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: Record<string, any>;
  actionPerformed?: boolean;
  expiry?: number; // Timestamp when notification expires
}

// Notification state interface
interface NotificationState {
  notifications: Notification[];
  hasUnreadNotifications: boolean;
  permissionGranted: boolean;
  pushToken: string | null;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  hasUnreadNotifications: false,
  permissionGranted: false,
  pushToken: null,
};

// Create notification slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'read' | 'timestamp'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        timestamp: Date.now(),
        read: false,
      };
      
      state.notifications.push(newNotification);
      state.hasUnreadNotifications = true;
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notificationIndex = state.notifications.findIndex(
        (notification) => notification.id === action.payload
      );
      
      if (notificationIndex !== -1) {
        state.notifications[notificationIndex].read = true;
      }
      
      // Update hasUnreadNotifications flag
      state.hasUnreadNotifications = state.notifications.some(notification => !notification.read);
    },
    
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      
      state.hasUnreadNotifications = false;
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
      
      // Update hasUnreadNotifications flag
      state.hasUnreadNotifications = state.notifications.some(notification => !notification.read);
    },
    
    clearExpiredNotifications: (state) => {
      const now = Date.now();
      
      state.notifications = state.notifications.filter(
        (notification) => !notification.expiry || notification.expiry > now
      );
      
      // Update hasUnreadNotifications flag
      state.hasUnreadNotifications = state.notifications.some(notification => !notification.read);
    },
    
    setNotificationActionPerformed: (state, action: PayloadAction<{id: string; performed: boolean}>) => {
      const notificationIndex = state.notifications.findIndex(
        (notification) => notification.id === action.payload.id
      );
      
      if (notificationIndex !== -1) {
        state.notifications[notificationIndex].actionPerformed = action.payload.performed;
      }
    },
    
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
    
    setPushToken: (state, action: PayloadAction<string | null>) => {
      state.pushToken = action.payload;
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.hasUnreadNotifications = false;
    },
  },
});

// Export actions
export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearExpiredNotifications,
  setNotificationActionPerformed,
  setPermissionGranted,
  setPushToken,
  clearAllNotifications,
} = notificationsSlice.actions;

// Export reducer
export default notificationsSlice.reducer; 