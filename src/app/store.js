import { configureStore } from '@reduxjs/toolkit';

// Placeholder slices (you will create these later)
import deckSlice from '../features/deckSlice'; 

const store = configureStore({
  reducer: {
    deck: deckSlice,  // Add other slices as needed
  },
});

export default store;
