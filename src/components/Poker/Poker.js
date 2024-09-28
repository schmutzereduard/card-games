/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drawCards, clearCards, shuffleDeck } from "../../features/deckSlice";
import { getProfile, extractFunds, addFunds } from '../../utils/LocalStorage';
import { checkHand } from './Hands';
import Paytable from './Paytable';
import History from './History';
import Controls from './Controls';
import Game from './Game';
import './Poker.css';

export const PokerContext = createContext(null);

function Poker() {
  const profile = getProfile();
  const { deck, isLoading, error, gameCards } = useSelector((state) => state.deck);
  const dispatch = useDispatch();
  const [bet, setBet] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastGame, setLastGame] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    if (!deck) {
      dispatch(shuffleDeck({ deckId: profile.deckId }));
    }
  }
    , [deck, profile]);

  const start = useCallback(() => {
    extractFunds(bet);
    setRound(1);
    setGameStarted(true);
    setLastGame([]);
    dispatch(shuffleDeck({ deckId: deck.deck_id }));
    dispatch(drawCards({ deckId: deck.deck_id, count: 5, target: "game" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bet, deck]);

  const end = useCallback(() => {
    setGameStarted(false);
    setRound(0);
    setSelectedCards([]);
    setLastGame(gameCards);
    dispatch(clearCards({ target: "game" }));

    const hand = checkHand(gameCards);
    const win = hand.multiplier * bet;
    setHistory([...history, `${profile.name} ${win > 0 ? `won ${win}$ with a ${hand.name}` : `lost ${bet}$`}`]);

    addFunds(win);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bet, profile, gameCards]);

  useEffect(() => {
    if (gameStarted && round === 3) {
      end();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, round]);

  return (
    error ? <p>Error: {error.message} </p> :
      (isLoading ? <p>Loading ... </p> :
        <PokerContext.Provider value={{ selectedCards, setSelectedCards, lastGame, setLastGame, history, setHistory, bet, setBet, gameStarted, setGameStarted, round, setRound, start, end }}>
          <h1>Poker Game</h1>
          <div className="Poker">
            <div className="Sidebar">
              <Paytable />
              <Controls />
            </div>
            <div className="Game-Container">
              <Game />
              <History />
            </div>
          </div>
        </PokerContext.Provider>
      ));
}

export default Poker;
