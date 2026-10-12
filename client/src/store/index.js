import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import skillsReducer from "./skillsSlice";
import matchesReducer from "./matchesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,
    matches: matchesReducer,
  },
});
