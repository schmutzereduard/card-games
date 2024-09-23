import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createContext, useState } from 'react';
import { drawCards, clearCards } from "../../features/deckSlice";
import Paytable from './Paytable';
import Betting from './Betting';
import Game from './Game';

export const PokerContext = createContext(null);
//88c9fnhfyxsz
function Poker() {
  const { deck, isLoading, error } = useSelector((state) => state.deck);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bet, setBet] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);

  const start = () => {
    setRound(1);
    setGameStarted(true);
    dispatch(drawCards({ deckId: deck.deck_id, count: 5, target: "game" }));
  }

  const end = () => {
    setGameStarted(false);
    setRound(0);
    dispatch(clearCards({ target: "game" }));
  }

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
