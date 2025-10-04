import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http";

// Fetch all match sessions
export const fetchAllMatchSessions = createAsyncThunk(
  "sessions/fetchAllMatchSessions",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.get(`/getMatchSessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch a particular match session
export const fetchMatchSession = createAsyncThunk(
  "sessions/fetchMatchSession",
  async (matchId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.get(`/getMatchSessions/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create or update match session
export const createMatchSession = createAsyncThunk(
  "sessions/createMatchSession",
  async ({ matchId, sessions }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.post(
        `/createSession`,
        { matchId, sessions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update actualRuns for a session
export const updateActualRuns = createAsyncThunk(
  "sessions/updateActualRuns",
  async ({ matchId, overRange, actualRuns }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.patch(
        `/updateSession`,
        { matchId, overRange, actualRuns },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create or update a session bet
export const createSessionBet = createAsyncThunk(
  "sessions/createSessionBet",
  async (
    { matchId, overRange, rate, tokenAmount, teamName },
    { rejectWithValue, getState }
  ) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.post(
        `/createSessionBet`,
        { matchId, overRange, rate, tokenAmount, teamName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data.bet;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const sessionSlice = createSlice({
  name: "sessions",
  initialState: {
    allSessions: [],
    currentMatch: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All sessions
      .addCase(fetchAllMatchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMatchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.allSessions = action.payload || [];
      })
      .addCase(fetchAllMatchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Single match session
      .addCase(fetchMatchSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(fetchMatchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create match session
      .addCase(createMatchSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMatchSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(createMatchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update actualRuns
      .addCase(updateActualRuns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActualRuns.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(updateActualRuns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // session bet
    builder
      .addCase(createSessionBet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSessionBet.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSessionBet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMatch } = sessionSlice.actions;
export default sessionSlice.reducer;
