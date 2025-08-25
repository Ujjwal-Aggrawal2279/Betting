import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http";

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page = 1, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get("/getUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit: 15 },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
