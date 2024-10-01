/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drawCards, clearCards, shuffleDeck } from "../../features/deckSlice";
import { getProfile, extractFunds, addFunds } from '../../utils/LocalStorage';
import { checkHand } from './Hands';
import Paytable from './Paytable';
import History from './History';
import Controls from './Controls';
import Game from './Game';
import './FiveCardDraw.css';

export const FiveCardDrawContext = createContext(null);

function FiveCardDraw() {
  const profile = getProfile();
  const { deck, isLoading, error, gameCards } = useSelector((state) => state.deck);
  const dispatch = useDispatch();
  const [bet, setBet] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastGame, setLastGame] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const gameCardsRef = useRef(gameCards);

  useEffect(() => {
    // Keep the ref updated with the latest gameCards
    gameCardsRef.current = gameCards;
  }, [gameCards]);

  useEffect(() => {
    if (!deck) {
      dispatch(shuffleDeck({ deckId: profile.deckId }));
    }
  }, [deck, profile]);

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
    console.log("end: " + new Date());
      gameCardsRef.current.forEach(element => {
        console.log(element.value + element.suit);
      });
    // Save the last game state immediately
    setLastGame([...gameCardsRef.current]); 
  
    const hand = checkHand(gameCardsRef.current);
    const win = hand.multiplier * bet;
  
    // Update the history
    setHistory([...history, `${profile.name} ${win > 0 ? `won ${win}$ with a ${hand.name}` : `lost ${bet}$`}`]);
    
    addFunds(win);
  
    // Delay clearing only the game cards (not lastGame)
    setTimeout(() => {
      setGameStarted(false);  // This will stop the current game
      setRound(0);
      setSelectedCards([]);
      dispatch(clearCards({ target: "game" }));  // Only clear gameCards, leave lastGame as is
    }, 2000);  // 2-second delay before clearing the current game cards
  }, [bet, profile, gameCards]);

  useEffect(() => {
    if (gameStarted && round === 3) {
      console.log("useEffect: " + new Date());
      gameCardsRef.current.forEach(element => {
        console.log(element.value + element.suit);
      });
      // Delay the end of the game to allow card updates
      setTimeout(() => {
        end();
      }, 3000); // 1 second delay
    }
  }, [gameStarted, round]);

  return (
    error ? <p>Error: {error.message} </p> :
      (isLoading ? <p>Loading ... </p> :
        <FiveCardDrawContext.Provider value={{ selectedCards, setSelectedCards, lastGame, setLastGame, history, setHistory, bet, setBet, gameStarted, setGameStarted, round, setRound, start, end }}>
          <h1>Five Card Draw</h1>
          <div className="FiveCardDraw">
            <div className="Sidebar">
              <Paytable />
              <Controls />
            </div>
            <div className="Game-Container">
              <Game />
              <History />
            </div>
          </div>
        </FiveCardDrawContext.Provider>
      ));
}

export default FiveCardDraw;
