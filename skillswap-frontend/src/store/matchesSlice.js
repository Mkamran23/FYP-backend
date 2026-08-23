import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { matchingService } from "../services/matchingService";

export const fetchMatches = createAsyncThunk("matches/fetchMatches", async (_, { getState, rejectWithValue }) => {
  const { accessToken, tokenType } = getState().auth;
  if (!accessToken) return [];
  try {
    const data = await matchingService.getMyMatches(tokenType, accessToken);
    return data.matches;
  } catch (error) {
    return rejectWithValue(error.message || "Unable to load recommendations");
  }
});

const matchesSlice = createSlice({
  name: "matches",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    removeMatch: (state, action) => { state.items = state.items.filter((match) => match.user.id !== action.payload); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchMatches.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload; })
      .addCase(fetchMatches.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; });
  },
});

export const { removeMatch } = matchesSlice.actions;
export default matchesSlice.reducer;
