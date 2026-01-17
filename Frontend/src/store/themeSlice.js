import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: localStorage.getItem("theme") || "dark",
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? 'light' : 'dark';
      console.log('Theme changed to:', state.theme);
      localStorage.setItem('theme', state.theme);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;