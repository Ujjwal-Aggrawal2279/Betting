import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import roleReducer from './slices/roleSlice'
import matchReducer from './slices/matchSlice'
import tokenReducer from './slices/tokenSlice'
import dashboardRouter from './slices/dashboardSlice'
import betReducer from './slices/betSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

// Persist config just for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'isAuthenticated']
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  users: userReducer,
  roles: roleReducer,
  match: matchReducer,
  tokens: tokenReducer,
  stats: dashboardRouter,
  bets: betReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
