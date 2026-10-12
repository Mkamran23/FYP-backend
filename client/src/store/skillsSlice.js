import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { skillService } from "../services/skillService";

export const fetchSkillCatalog = createAsyncThunk(
  "skills/fetchCatalog",
  async (_, { rejectWithValue }) => {
    try {
      return await skillService.getCatalog();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const skillsSlice = createSlice({
  name: "skills",
  initialState: { catalog: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillCatalog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSkillCatalog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.catalog = action.payload;
      })
      .addCase(fetchSkillCatalog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load the skill catalog";
      });
  },
});

export default skillsSlice.reducer;
