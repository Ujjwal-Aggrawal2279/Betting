import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import http from '../../services/http'

// 🎯 Thunk: Place a bet
export const createBet = createAsyncThunk(
  'bets/createBet',
  async (betData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      const token = auth.token
      const { data } = await http.post('/placebet', betData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return data.bet
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to place bet'
      )
    }
  }
)

// 🎯 Thunk: Fetch Bets List (self + descendants)
export const fetchBets = createAsyncThunk(
  'bets/fetchBets',
  async ({ page = 1, limit = 15 } = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      const token = auth.token
      const { data } = await http.get(`/betslist?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch bets'
      )
    }
  }
)

const betSlice = createSlice({
  name: 'bets',
  initialState: {
    bets: [],
    total: 0,
    page: 1,
    limit: 15,
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearBetStatus: state => {
      state.error = null
      state.successMessage = null
    }
  },
  extraReducers: builder => {
    builder
      // create bet
      .addCase(createBet.pending, state => {
        state.loading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createBet.fulfilled, (state, action) => {
        state.loading = false
        state.bets.unshift(action.payload) // show new bet on top
        state.successMessage = 'Bet placed successfully!'
      })
      .addCase(createBet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // fetch bets
      .addCase(fetchBets.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBets.fulfilled, (state, action) => {
        state.loading = false
        state.bets = action.payload.data
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchBets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearBetStatus } = betSlice.actions
export default betSlice.reducer
