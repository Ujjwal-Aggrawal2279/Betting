import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http";

// Fetch all roles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get("/getRoles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch role details
export const fetchRoleDetails = createAsyncThunk(
  "roles/fetchRoleDetails",
  async (roleId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get(`/roleDetails/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch role permissions
export const fetchRolePermissions = createAsyncThunk(
  "roles/fetchRolePermissions",
  async (roleId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.get(`/rolePermissions/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { roleId, permissions: data.permissions };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create new role
export const createRole = createAsyncThunk(
  "roles/createRole",
  async ({ name, parentRole, permissions }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const { data } = await http.post(
        "/createRole",
        { name, parentRole, permissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Edit role
export const editRole = createAsyncThunk(
  "roles/editRole",
  async ({ roleId, permissions }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.put(
        `/editRole/${roleId}`,
        {
          roleId,
          permissions,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete role
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (roleId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const { data } = await http.delete(`/deleteRole/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    tree: [],
    selectedRolePermissions: [],
    selectedRoleDetails: null,
    loadingRoles: false,
    loadingRoleDetails: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchRoles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.list = action.payload.options;
        state.tree = action.payload.tree;
        state.loading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchRoleDetails
      .addCase(fetchRoleDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedRoleDetails = null;
      })
      .addCase(fetchRoleDetails.fulfilled, (state, action) => {
        state.selectedRoleDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchRolePermissions
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.selectedRolePermissions = action.payload.permissions;
      })

      // createRole
      .addCase(createRole.fulfilled, () => {})

      // editRole
      .addCase(editRole.fulfilled, () => {});
  },
});

export const { clearSelectedRole } = roleSlice.actions;
export default roleSlice.reducer;
