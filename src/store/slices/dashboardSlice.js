import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http";

// =======================
// Async Thunks
// =======================

// Fetch dashboard stats (already existing)
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get("/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch current month token data
export const fetchMonthlyTokenData = createAsyncThunk(
  "dashboard/fetchMonthlyTokenData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get("/dashboard/chart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// Slice
// =======================
const initialState = {
  totalUsers: 0,
  totalActiveUsers: 0,
  totalInactiveUsers: 0,
  newUsers: 0,
  liveMatches: 0,
  completedMatches: 0,
  cancelledMatches: 0,
  scheduledMatches: 0,
  tokensRequested: 0,
  tokensApproved: 0,
  tokensPendingApproval: 0,
  tokensRejected: 0,
  monthlyTokenData: [], // NEW: for chart
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.totalUsers = 0;
      state.totalActiveUsers = 0;
      state.totalInactiveUsers = 0;
      state.newUsers = 0;
      state.monthlyTokenData = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers = action.payload.totalUsers;
        state.totalActiveUsers = action.payload.totalActiveUsers;
        state.totalInactiveUsers = action.payload.totalInactiveUsers;
        state.liveMatches = action.payload.liveMatches;
        state.completedMatches = action.payload.completedMatches;
        state.cancelledMatches = action.payload.cancelledMatches;
        state.scheduledMatches = action.payload.scheduledMatches;
        state.tokensRequested = action.payload.tokensRequested;
        state.tokensApproved = action.payload.tokensApproved;
        state.tokensPendingApproval = action.payload.tokensPendingApproval;
        state.tokensRejected = action.payload.tokensRejected;
        state.newUsers = action.payload.newUsers;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to fetch dashboard stats";
      });

    // Monthly token data
    builder
      .addCase(fetchMonthlyTokenData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyTokenData.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTokenData = action.payload;
      })
      .addCase(fetchMonthlyTokenData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to fetch monthly token data";
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
