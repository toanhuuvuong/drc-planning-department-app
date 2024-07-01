import { createSlice } from '@reduxjs/toolkit';

// State
const initialState = {
  username: '',
  firstName: '',
  lastName: '',
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authReset() {
      return initialState;
    },
  },
});

// Action creators
export const { authReset } = authSlice.actions;

export default authSlice;
