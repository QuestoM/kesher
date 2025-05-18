import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define user state interface
interface UserState {
  id: string | null;
  name: string | null;
  phoneNumber: string | null;
  unit: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  prefersDarkMode: boolean | null;
  language: 'he' | 'en';
}

// Define initial state
const initialState: UserState = {
  id: null,
  name: null,
  phoneNumber: null,
  unit: null,
  email: null,
  isAuthenticated: false,
  isOnboarded: false,
  prefersDarkMode: null, // null means system default
  language: 'he', // Default to Hebrew
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setOnboarded: (state, action: PayloadAction<boolean>) => {
      state.isOnboarded = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean | null>) => {
      state.prefersDarkMode = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'he' | 'en'>) => {
      state.language = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

// Export actions
export const {
  setUser,
  clearUser,
  setAuthenticated,
  setOnboarded,
  setDarkMode,
  setLanguage,
  updateUserProfile,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer; 