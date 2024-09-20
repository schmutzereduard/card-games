import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { drawFromDeck, fetchNewDeck, shuffleTheDeck } from '../api/deckApi';
// Thunk to fetch a new deck from the Deck of Cards API
export const fetchDeck = createAsyncThunk(
  'deck/fetchDeck', //creates 3 subactions: fetchDeck.pending, fetchDeck.fufilled, fetchDeck.rejected
  async () => {
    const response = await fetchNewDeck();
    alert("Your new deck id is: " + response.data.deck_id);
    return response.data;
  }
);

export const shuffleDeck = createAsyncThunk(
  'deck/shuffleDeck',
  async (deckId) => {
    const response = await shuffleTheDeck(deckId);
    return response.data;
  }
);

export const drawCards = createAsyncThunk(
  'deck/drawCards',
  async ({ deckId, count, target }) => {
    const response = await drawFromDeck(deckId, count);
    return { cards: response.data.cards, target }; // Return cards and target
  }
);

const deckSlice = createSlice({
  name: 'deck', //this will be used to access the data (ex: state.deck)
  initialState: {
    deck: null,
    gameCards: [],
    playerCards: [],
    isLoading: false,
    error: null,
  },
  reducers: {}, //sync actions
  extraReducers: (builder) => { //async actions
    builder
      .addCase(fetchDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDeck.fulfilled, (state, action) => {
        state.deck = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDeck.rejected, (state, action) => {
        state.error = action.error;
        state.isLoading = false;
      })
      .addCase(shuffleDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(shuffleDeck.fulfilled, (state, action) => {
        state.deck = action.payload;
        state.isLoading = false;
      })
      .addCase(shuffleDeck.rejected, (state, action) => {
        state.error = action.error;
        state.isLoading = false;
      })
      .addCase(drawCards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(drawCards.fulfilled, (state, action) => {
        if (action.meta.arg.target === "game") {
          state.gameCards = action.payload.cards; // Access payload.cards
        } else if (action.meta.arg.target === "player") {
          state.playerCards = action.payload.cards; // Access payload.cards
        }
        state.isLoading = false;
      })
      .addCase(drawCards.rejected, (state, action) => {
        state.error = action.error;
        state.isLoading = false;
      })
      ;
  },
});

export default deckSlice.reducer;
