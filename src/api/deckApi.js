// src/api/deckApi.js
import axios from 'axios';
import { DRAW_CARD_URL, NEW_DECK_URL, SHUFFLE_DECK_URL } from '../Constants';

export const fetchNewDeck = () => {
  return axios.get(NEW_DECK_URL);
};

export const shuffleTheDeck = (deckId) => {
  return axios.get(SHUFFLE_DECK_URL.replace("{DECK_ID}", deckId));
};

export const drawFromDeck = (deckId, count) => {
  return axios.get(DRAW_CARD_URL.replace("{DECK_ID}", deckId) + count);
}
