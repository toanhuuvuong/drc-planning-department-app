import { createSlice } from '@reduxjs/toolkit';

type State = {};

// State
const initialState: State = {};

// Slice
const suppliesStoreInventoryDashboardSlice = createSlice({
  name: 'suppliesStoreInventoryDashboard',
  initialState,
  reducers: {
    resetSuppliesStoreInventoryDashboardState() {
      return initialState;
    },
  },
});

// Action creators
export const { resetSuppliesStoreInventoryDashboardState } = suppliesStoreInventoryDashboardSlice.actions;

export default suppliesStoreInventoryDashboardSlice;
