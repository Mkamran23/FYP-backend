import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

const STORAGE_KEY = "skillswap_auth";

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || "null");
    if (!session) return null;
    const accessToken = session.accessToken || session.token;
    if (!accessToken || (session.expiresAt && new Date(session.expiresAt) <= new Date())) return null;
    return { ...session, accessToken, tokenType: session.tokenType || "Bearer" };
  } catch { return null; }
}

function saveSession(session, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  storage.setItem(STORAGE_KEY, JSON.stringify(session));
}

const reject = (error) => error.message || "Something went wrong. Please try again.";

export const signIn = createAsyncThunk("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try { return await authService.login({ email, password }); } catch (error) { return rejectWithValue(reject(error)); }
});
export const signUp = createAsyncThunk("auth/signUp", async (payload, { rejectWithValue }) => {
  try { return await authService.register(payload); } catch (error) { return rejectWithValue(reject(error)); }
});
export const verifySession = createAsyncThunk("auth/verifySession", async (_, { getState, rejectWithValue }) => {
  const { accessToken, tokenType } = getState().auth;
  if (!accessToken) return null;
  try { return await authService.getCurrentUser(tokenType, accessToken); } catch (error) { return rejectWithValue(reject(error)); }
});
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try { return await authService.forgotPassword(email); } catch (error) { return rejectWithValue(reject(error)); }
});
export const resetPassword = createAsyncThunk("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try { return await authService.resetPassword(payload); } catch (error) { return rejectWithValue(reject(error)); }
});
export const updateProfile = createAsyncThunk("auth/updateProfile", async (profile, { getState, rejectWithValue }) => {
  const { accessToken, tokenType } = getState().auth;
  try { return await authService.updateProfile(profile, tokenType, accessToken); } catch (error) { return rejectWithValue(reject(error)); }
});
export const uploadProfilePhoto = createAsyncThunk("auth/uploadProfilePhoto", async (photo, { getState, rejectWithValue }) => {
  const { accessToken, tokenType } = getState().auth;
  try { return await authService.uploadProfilePhoto(photo, tokenType, accessToken); } catch (error) { return rejectWithValue(reject(error)); }
});

const session = readSession();
const authSlice = createSlice({
  name: "auth",
  initialState: { ...session, user: session?.user || null, accessToken: session?.accessToken || null, tokenType: session?.tokenType || "Bearer", isCheckingAuth: true },
  reducers: {
    signOut: (state) => {
      localStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(STORAGE_KEY);
      state.user = null; state.accessToken = null; state.tokenType = "Bearer"; state.expiresAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        const next = { accessToken: action.payload.token, tokenType: action.payload.tokenType, expiresAt: action.payload.expiresAt, user: action.payload.user };
        Object.assign(state, next); saveSession(next, action.meta.arg.remember);
      })
      .addCase(signUp.fulfilled, (state, action) => {
        const next = { accessToken: action.payload.token, tokenType: action.payload.tokenType, expiresAt: action.payload.expiresAt, user: action.payload.user };
        Object.assign(state, next); saveSession(next);
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        if (action.payload?.user) { state.user = { ...state.user, ...action.payload.user }; saveSession({ accessToken: state.accessToken, tokenType: state.tokenType, expiresAt: state.expiresAt, user: state.user }, Boolean(localStorage.getItem(STORAGE_KEY))); }
      })
      .addCase(verifySession.rejected, (state) => { state.isCheckingAuth = false; state.user = null; state.accessToken = null; localStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem(STORAGE_KEY); })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload.user; saveSession({ accessToken: state.accessToken, tokenType: state.tokenType, expiresAt: state.expiresAt, user: state.user }, Boolean(localStorage.getItem(STORAGE_KEY))); })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => { state.user = action.payload.user; saveSession({ accessToken: state.accessToken, tokenType: state.tokenType, expiresAt: state.expiresAt, user: state.user }, Boolean(localStorage.getItem(STORAGE_KEY))); });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
