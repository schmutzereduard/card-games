import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paytable from './Paytable';
import { createContext, useState } from 'react';
import Betting from './Betting';

export const PokerContext = createContext(null);
//88c9fnhfyxsz
function Poker() {
  const { deck, isLoading, error } = useSelector((state) => state.deck);
  const navigate = useNavigate();
  const [bet, setBet] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);

  return (
    <PokerContext.Provider value={{ bet, setBet, gameStarted, setGameStarted, round, setRound }}>
    <div>
      <h1>Poker Game</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {deck && <p>Deck ID: {deck.deck_id}</p>}
      <Paytable />
      <Betting />
      <button onClick={() => navigate("/")}>Home</button>
    </div>
    </PokerContext.Provider>
  );
}

export default Poker;
