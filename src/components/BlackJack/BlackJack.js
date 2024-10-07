import { createContext, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shuffleDeck, clearCards, drawCards } from "../../features/deckSlice";
import Controls from './Controls';
import Game from './Game';
import './BlackJack.css';
import { addFunds, extractFunds, getProfile } from '../../utils/LocalStorage';
import { blackJack, busted, handValue } from './Utils';

export const BlackJackContext = createContext(null);

function BlackJack() {

    const dispatch = useDispatch();
    const profile = getProfile();

    const { deck, playerCards, gameCards } = useSelector((state) => state.deck);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);
    const [dealerTurn, setDealerTurn] = useState(false);

    const [betValue, setBetValue] = useState(1);
    const [playerValue, setPlayerValue] = useState(0);
    const [dealerValue, setDealerValue] = useState(0);
    const [winner, setWinner] = useState("");

    useEffect(() => {
        if ("player" === winner)
            addFunds(betValue);
        else if ("game" === winner)
            extractFunds(betValue);

    }, [betValue, winner]);

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
        setWinner("");
        dispatch(shuffleDeck({ deckId: deck.deck_id }));
        setGameStarted(true);
        setPlayerTurn(true);
        setDealerTurn(false);
        dispatch(drawCards({ deckId: deck.deck_id, count: 2, target: "player" }));
        dispatch(drawCards({ deckId: deck.deck_id, count: 1, target: "game" }));
    }, [deck, dispatch]);

    const decideWinner = useCallback(() => {
        const playerDiff = 21 - playerValue;
        const dealerDiff = 21 - dealerValue;

        if (playerDiff < dealerDiff && !busted(playerValue))
            setWinner("player");
        else if (dealerDiff < playerDiff && !busted(dealerValue))
            setWinner("game");
        else if (playerDiff === dealerDiff)
            setWinner("tie");
    }, [playerValue, dealerValue]);

    const end = useCallback(() => {
        decideWinner();
        setTimeout(() => {
            setGameStarted(false);
            setPlayerTurn(false);
            setDealerTurn(false);
            dispatch(clearCards({ target: "player" }));
            dispatch(clearCards({ target: "game" }));
        }, 3000);
        
    }, [decideWinner, dispatch]);

    useEffect(() => {
        if (busted(playerValue) || busted(dealerValue))
            end();
        if (blackJack(playerValue))
            end();
    }, [playerValue, dealerValue, end]);

    

    return (
        <BlackJackContext.Provider value={{
            start, end,
            gameStarted, setGameStarted,
            betValue, setBetValue,
            winner, setWinner,
            playerTurn, setPlayerTurn,
            dealerTurn, setDealerTurn,
            playerValue, dealerValue
        }}>
            <h1>BlackJack | 21</h1>
            <div className="BlackJack">

                <Controls />
                <Game />

            </div>
        </BlackJackContext.Provider>
    );


}

export default BlackJack;