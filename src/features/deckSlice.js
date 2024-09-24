import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { drawFromDeck, fetchNewDeck, shuffleTheDeck } from '../api/deckApi';
import { getProfile, saveProfile } from '../utils/LocalStorage';
// Thunk to fetch a new deck from the Deck of Cards API
export const fetchDeck = createAsyncThunk(
  'deck/fetchDeck', //creates 3 subactions: fetchDeck.pending, fetchDeck.fufilled, fetchDeck.rejected
  async () => {
    const response = await fetchNewDeck();
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

export const changeCards = createAsyncThunk(
  'deck/changeCards',
  async ({ deckId, count, targetHand, targetCards }) => {
    const response = await drawFromDeck(deckId, count);
    return { cards: response.data.cards, targetHand, targetCards };
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
  reducers: {
    clearCards: (state, action) => {
      const { target } = action.payload;
      if (target === "game") {
        state.gameCards = [];
      } else if (target === "player") {
        state.playerCards = [];
      }
    }
  }, //sync actions
  extraReducers: (builder) => { //async actions
    builder
      .addCase(fetchDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDeck.fulfilled, (state, action) => {
        state.deck = action.payload;
        state.isLoading = false;
        const profile = getProfile();
        if (profile) {
          profile.deckId = state.deck.deck_id;
          saveProfile(profile);
        } else {
          saveProfile({ name: "Guest", funds: 10, deckId: state.deck.deck_id });
        }
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
      .addCase(changeCards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeCards.fulfilled, (state, action) => {
        const { cards } = action.payload;
        const { targetHand, targetCards } = action.meta.arg;
        if (targetHand === "game") {
          state.gameCards = [
            ...state.gameCards.filter(card => !targetCards.some(selectedCard => selectedCard.code === card.code)),
            ...cards
          ];
        } else if (action.meta.arg.target === "player") {
          state.playerCards = [
            ...state.playerCards.filter(card => !targetCards.some(selectedCard => selectedCard.code === card.code)),
            ...cards
          ];
        }
        state.isLoading = false;
      })
      .addCase(changeCards.rejected, (state, action) => {
        state.error = action.error;
        state.isLoading = false;
      })
      ;
  },
});

export const { clearCards } = deckSlice.actions;
export default deckSlice.reducer;
