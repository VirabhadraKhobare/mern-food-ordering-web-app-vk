import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE } from '../../config';
const token = localStorage.getItem('token');
const initialState = { user: null, token, status: 'idle', error: null };
export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI)=>{
  const t = localStorage.getItem('token');
  if(!t) return null;
  const res = await axios.get(API_BASE + '/users/profile', { headers: { Authorization: 'Bearer ' + t } });
  return res.data;
});
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action){ state.token = action.payload; localStorage.setItem('token', action.payload); },
    logout(state){ state.token = null; state.user = null; localStorage.removeItem('token'); }
  },
  extraReducers: (builder)=>{
    builder.addCase(fetchProfile.fulfilled, (state, action)=>{ state.user = action.payload; });
  }
});
export const { setToken, logout } = slice.actions;
export default slice.reducer;
