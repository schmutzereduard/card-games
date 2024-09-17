// src/api/deckApi.js
import axios from 'axios';

const DECK_API_BASE_URL = 'https://deckofcardsapi.com/api/deck/';

export const fetchNewDeck = () => {
  return axios.get(`${DECK_API_BASE_URL}new/shuffle/`);
};
