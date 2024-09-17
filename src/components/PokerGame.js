import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDeck } from '../features/deckSlice';

function PokerGame() {
  const dispatch = useDispatch();
  const { deck, isLoading, error } = useSelector((state) => state.deck);

  useEffect(() => {
    dispatch(fetchDeck());
  }, [dispatch]);

  return (
    <div>
      <h1>Poker Game</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {deck && <p>Deck ID: {deck.deck_id}</p>}
    </div>
  );
}

export default PokerGame;
