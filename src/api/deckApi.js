// src/api/deckApi.js
import axios from 'axios';
import { NEW_DECK_URL, SHUFFLE_DECK_URL } from '../Constants';

export const fetchNewDeck = () => {
  return axios.get(NEW_DECK_URL);
};

export const shuffleTheDeck = (deckId) => {
  return axios.get(SHUFFLE_DECK_URL.replace("{DECK_ID}", deckId));
};
