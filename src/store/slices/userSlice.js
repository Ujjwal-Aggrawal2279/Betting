import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http";

// Fetch users with filters
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    { page = 1, role = "all", fullName = "" },
    { rejectWithValue, getState }
  ) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get("/getUsers", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 15, role, fullName },
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single user
export const getSingleUser = createAsyncThunk(
  "users/getSingleUser",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get(`/getSingleUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { user: data.user, versionHistory: data.versionHistory };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create new user
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.post("/createUser", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.patch(`/patchUser/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.delete(`/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { userId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Manage tokens
export const manageUserTokens = createAsyncThunk(
  "users/manageUserTokens",
  async ({ userId, action, amount }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.post(
        `/users/${userId}/tokens`,
        { action, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { userId, tokens: data.tokens, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    user: null,
    versionHistory: null,
    loading: false,
    error: null,
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    fetchingSingleUser: false,
    singleUserError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
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
      })
      // createUser
      .addCase(createUser.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.creating = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      // getSingleUser
      .addCase(getSingleUser.pending, (state) => {
        state.fetchingSingleUser = true;
        state.singleUserError = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.fetchingSingleUser = false;
        state.user = action.payload.user;
        state.versionHistory = action.payload.versionHistory;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.fetchingSingleUser = false;
        state.singleUserError = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updating = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })
      // deleteUser
      .addCase(deleteUser.pending, (state) => {})
      .addCase(deleteUser.fulfilled, (state, action) => {})
      .addCase(deleteUser.rejected, (state, action) => {})
      // manage tokens
      .addCase(manageUserTokens.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(manageUserTokens.fulfilled, (state, action) => {
        state.updating = false;
      })
      .addCase(manageUserTokens.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export default userSlice.reducer;
