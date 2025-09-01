import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http";

// =======================
// Async Thunks
// =======================

// Fetch token list with pagination
export const fetchTokens = createAsyncThunk(
  "tokens/fetchTokens",
  async (page = 1, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get("/getTokens", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 15 },
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Request a token
export const requestToken = createAsyncThunk(
  "tokens/requestToken",
  async (tokenAmount, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.post(
        "/requestToken",
        { tokenAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update token status (approve/reject/cancel)
export const updateTokenStatus = createAsyncThunk(
  "tokens/updateTokenStatus",
  async ({ tokenId, status }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.put(
        `/updateTokenStatus/${tokenId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data.data; // updated token
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =======================
// Slice
// =======================
const initialState = {
  tokens: [],
  loading: false,
  error: null,
  page: 1,
  limit: 15,
  total: 0,
  requesting: false,
  requestError: null,
  requestSuccess: false,
};

const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    clearTokens: (state) => {
      state.tokens = [];
      state.loading = false;
      state.error = null;
      state.page = 1;
      state.total = 0;
    },
    clearRequestState: (state) => {
      state.requesting = false;
      state.requestError = null;
      state.requestSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // -------------------------------
    // Fetch Tokens
    // -------------------------------
    builder
      .addCase(fetchTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload.data || [];
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 15;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchTokens.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to fetch tokens";
      });

    // -------------------------------
    // Request Token
    // -------------------------------
    builder
      .addCase(requestToken.pending, (state) => {
        state.requesting = true;
        state.requestError = null;
        state.requestSuccess = false;
      })
      .addCase(requestToken.fulfilled, (state, action) => {
        state.requesting = false;
        state.requestSuccess = true;
        state.tokens = [action.payload.data, ...state.tokens];
      })
      .addCase(requestToken.rejected, (state, action) => {
        state.requesting = false;
        state.requestError =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to request token";
      });

    // -------------------------------
    // Update Token Status
    // -------------------------------
    builder
      .addCase(updateTokenStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTokenStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedToken = action.payload;
        const index = state.tokens.findIndex((t) => t._id === updatedToken._id);
        if (index !== -1) {
          state.tokens[index] = updatedToken;
        }
      })
      .addCase(updateTokenStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload && action.payload.message) ||
          action.payload ||
          "Failed to update token status";
      });
  },
});

export const { clearTokens, clearRequestState } = tokenSlice.actions;
export default tokenSlice.reducer;
