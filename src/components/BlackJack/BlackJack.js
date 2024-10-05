import { createContext, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shuffleDeck, clearCards, drawCards } from "../../features/deckSlice";
import Controls from './Controls';
import Game from './Game';
import './BlackJack.css';
import { getProfile } from '../../utils/LocalStorage';
import { handValue } from './Utils';

export const BlackJackContext = createContext(null);

function BlackJack() {

    const dispatch = useDispatch();
    const profile = getProfile();

    const { deck, playerCards, gameCards } = useSelector((state) => state.deck);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);

    const [playerValue, setPlayerValue] = useState(0);
    const [dealerValue, setDealerValue] = useState(0);


    useEffect(() => {
        setPlayerValue(handValue(playerCards));
    }, [playerCards]);

    useEffect(() => {
        setDealerValue(handValue(gameCards));
    }, [gameCards]);

    useEffect(() => {
        if (!deck) {
          dispatch(shuffleDeck({ deckId: profile.deckId }));
        }
      }, [deck, profile, dispatch]);

    const start = useCallback(() => {
        dispatch(shuffleDeck({ deckId: deck.deck_id }));
        setGameStarted(true);
        setPlayerTurn(true);
        dispatch(drawCards({ deckId: deck.deck_id, count: 2, target: "player" }));
        dispatch(drawCards({ deckId: deck.deck_id, count: 1, target: "game" }));
    }, [deck, dispatch]);

    const end = useCallback(() => {
        setGameStarted(false);
        setPlayerTurn(false);
        dispatch(clearCards({ target: "player" }));
        dispatch(clearCards({ target: "game" }));
    }, [dispatch]);

    return (
        <BlackJackContext.Provider value={{ start, end, gameStarted, setGameStarted, playerTurn, setPlayerTurn, playerValue, dealerValue }}>
            <h1>BlackJack | 21</h1>
            <div className="BlackJack">

                <Controls />
                <Game />

            </div>
        </BlackJackContext.Provider>
    );


}

export default BlackJack;