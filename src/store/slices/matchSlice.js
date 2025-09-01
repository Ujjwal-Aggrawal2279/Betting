import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http";

// =======================
// Async Thunks
// =======================

// Fetch matches by status
export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (status, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.get(`/getMatches?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch all match odds
export const fetchMatchOdds = createAsyncThunk(
  "matches/fetchMatchOdds",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.get(`/getMatchOdds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create match odds
export const createMatchOdds = createAsyncThunk(
  "matches/createMatchOdds",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.post(`/createOdds`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { message: data.message, data: data.data };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to create odds";
      return rejectWithValue({ message: msg });
    }
  }
);

// Fetch hierarchical odds for a particular match
export const getMatchOddsByHierarchy = createAsyncThunk(
  "matches/getMatchOddsByHierarchy",
  async (matchId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.get(`/getMatchOdds/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch ScoreCard
export const getMatchScoreCard = createAsyncThunk(
  "matches/getMatchScoreCard",
  async (matchId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.get(`/getScoreCard/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// Slice
// =======================
const initialState = {
  matches: [],
  matchOdds: [],
  hierarchicalOdds: null,
  matchScoreCard: null,
  loadingMatches: false,
  loadingOdds: false,
  loadingHierarchy: false,
  loadingScoreCard: false,
  creatingOdds: false,
  error: null,
};

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    clearMatches: (state) => {
      state.matches = [];
      state.matchOdds = [];
      state.hierarchicalOdds = null;
      state.loadingMatches = false;
      state.loadingOdds = false;
      state.loadingHierarchy = false;
      state.creatingOdds = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Matches
      .addCase(fetchMatches.pending, (state) => {
        state.loadingMatches = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loadingMatches = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loadingMatches = false;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to fetch matches";
      })

      // Fetch Match Odds
      .addCase(fetchMatchOdds.pending, (state) => {
        state.loadingOdds = true;
        state.error = null;
      })
      .addCase(fetchMatchOdds.fulfilled, (state, action) => {
        state.loadingOdds = false;
        state.matchOdds = action.payload;
      })
      .addCase(fetchMatchOdds.rejected, (state, action) => {
        state.loadingOdds = false;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to fetch odds";
      })

      // Create Match Odds
      .addCase(createMatchOdds.pending, (state) => {
        state.creatingOdds = true;
        state.error = null;
      })
      .addCase(createMatchOdds.fulfilled, (state) => {
        state.creatingOdds = false;
      })
      .addCase(createMatchOdds.rejected, (state, action) => {
        state.creatingOdds = false;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to create odds";
      })

      // Fetch Hierarchical Match Odds
      .addCase(getMatchOddsByHierarchy.pending, (state) => {
        state.loadingHierarchy = true;
        state.error = null;
      })
      .addCase(getMatchOddsByHierarchy.fulfilled, (state, action) => {
        state.loadingHierarchy = false;
        state.hierarchicalOdds = action.payload;
      })
      .addCase(getMatchOddsByHierarchy.rejected, (state, action) => {
        state.loadingHierarchy = false;
        state.hierarchicalOdds = null;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to fetch hierarchical odds";
      })

      // Fetch ScoreCard
      .addCase(getMatchScoreCard.pending, (state) => {
        state.loadingScoreCard = true;
        state.error = null;
      })
      .addCase(getMatchScoreCard.fulfilled, (state, action) => {
        state.loadingScoreCard = false;
        state.matchScoreCard = action.payload;
      })
      .addCase(getMatchScoreCard.rejected, (state, action) => {
        state.loadingScoreCard = false;
      });
  },
});

export const { clearMatches } = matchesSlice.actions;
export default matchesSlice.reducer;
