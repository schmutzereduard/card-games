import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { drawCards, clearCards, shuffleDeck } from "../../features/deckSlice";
import { getProfile, extractFunds, addFunds } from '../../utils/LocalStorage';
import { checkHand } from './Hands';
import Paytable from './Paytable';
import Betting from './Betting';
import Game from './Game';
import './Poker.css';

export const PokerContext = createContext(null);

function Poker() {
  const profile = getProfile();
  const { deck, isLoading, error, gameCards } = useSelector((state) => state.deck);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bet, setBet] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    if (!deck && profile.deckId) {
      dispatch(shuffleDeck(profile.deckId));
    }
  }, [deck, profile, dispatch]);

  

  const start = useCallback(() => {
    extractFunds(bet);
    setRound(1);
    setGameStarted(true);
    dispatch(drawCards({ deckId: deck.deck_id, count: 5, target: "game" }));
  }, [bet, deck, dispatch]);

  const end = useCallback(() => {
    setGameStarted(false);
    setRound(0);
    dispatch(clearCards({ target: "game" }));

    const hand = checkHand(gameCards);
    const win = hand.multiplier * bet;
    setResultMessage(`${profile.name} ${win > 0 ? `won ${win}$ with a ${hand.name}` : `lost ${bet}$`}`);

    addFunds(win);
  }, [bet, profile, dispatch, gameCards]);

  useEffect(() => {
    if (gameStarted && round === 3) {
      end();
    }
  }, [gameStarted, round]);

  return (
    <PokerContext.Provider value={{ bet, setBet, gameStarted, setGameStarted, round, setRound, resultMessage, setResultMessage, start, end }}>
      <div className="Poker">
        <h1>Poker Game</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}

        {resultMessage && <p>{resultMessage}</p>}

        <Paytable />
        <Betting />
        <Game />

        <button onClick={() => navigate("/")}>Home</button>
      </div>
    </PokerContext.Provider>
  );
}

export default Poker;
