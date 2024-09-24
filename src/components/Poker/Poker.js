import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createContext, useCallback, useEffect, useState } from 'react';
import { drawCards, clearCards, shuffleDeck } from "../../features/deckSlice";
import Paytable from './Paytable';
import Betting from './Betting';
import Game from './Game';
import { getProfile } from '../../utils/LocalStorage';

export const PokerContext = createContext(null);

function Poker() {
  const profile = getProfile();
  const { deck, isLoading, error } = useSelector((state) => state.deck);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bet, setBet] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!deck) {
      dispatch(shuffleDeck(profile.deckId));
    }
  }, [dispatch, profile, deck]);

  const start = useCallback(() => {
    setRound(1);
    setGameStarted(true);
    dispatch(drawCards({ deckId: deck.deck_id, count: 5, target: "game" }));
  }, [deck, dispatch]);

  const end = useCallback(() => {
    setGameStarted(false);
    setRound(0);
    dispatch(clearCards({ target: "game" }));
  }, [dispatch]);

  return (
    <PokerContext.Provider value={{ bet, setBet, gameStarted, setGameStarted, round, setRound, start, end }}>
      <div>
        <h1>Poker Game</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}

        <Paytable />
        <Betting />
        <Game />

        <button onClick={() => navigate("/")}>Home</button>
      </div>
    </PokerContext.Provider>
  );
}

export default Poker;
