import { createContext, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shuffleDeck, clearCards, drawCards } from "../../features/deckSlice";
import Controls from './Controls';
import Game from './Game';
import './BlackJack.css';
import { addFunds, extractFunds, getProfile } from '../../utils/LocalStorage';
import { blackJack, busted, handValue } from './Utils';
import History from './History';

export const BlackJackContext = createContext(null);

function BlackJack() {

    const dispatch = useDispatch();
    const profile = getProfile();

    const { deck, playerCards, gameCards } = useSelector((state) => state.deck);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);
    const [dealerTurn, setDealerTurn] = useState(false);
    const [history, setHistory] = useState([]);

    const [betValue, setBetValue] = useState(1);
    const [playerValue, setPlayerValue] = useState(0);
    const [dealerValue, setDealerValue] = useState(0);
    const [result, setResult] = useState("");

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
        setResult("");
        setGameStarted(true);
        setPlayerTurn(true);
        setDealerTurn(false);
        dispatch(shuffleDeck({ deckId: deck.deck_id }));
        dispatch(drawCards({ deckId: deck.deck_id, count: 2, target: "player" }));
        dispatch(drawCards({ deckId: deck.deck_id, count: 1, target: "game" }));
    }, [deck, dispatch]);

    const getResult = useCallback(() => {
        const playerDiff = 21 - playerValue;
        const dealerDiff = 21 - dealerValue;

        if (busted(playerValue) || blackJack(dealerValue))
            setResult("dealerWon");
        else if (busted(dealerValue) || blackJack(playerValue))
            setResult("playerWon");
        else if (playerTurn && !dealerTurn)
            setResult("forfeit");
        else if (playerDiff < dealerDiff)
            setResult("playerWon");
        else if (dealerDiff < playerDiff)
            setResult("dealerWon");
        else if (playerDiff === dealerDiff)
            setResult("tie");
    }, [playerValue, dealerValue, playerTurn, dealerTurn]);

    useEffect(() => {

        switch(result) {
            case "playerWon": {
                addFunds(betValue);
                setHistory([...history, `Player won ${betValue}$ | P:${playerValue} vs D:${dealerValue}`]); 
                break;
            }
            case "dealerWon": {
                setHistory([...history, `Player lost ${betValue}$ | P:${playerValue} vs D:${dealerValue}`]);
                extractFunds(betValue); 
                break;
            }
            case "forfeit": {
                const fundsLost = betValue > 1 ? betValue / 2 : betValue;
                setHistory([...history, `Player forfeited losing ${fundsLost}$ | P:${playerValue} vs D:${dealerValue}`]);
                extractFunds(fundsLost); 
                break;
            }
            case "tie": {
                setHistory([...history, `Tie | P:${playerValue} vs D:${dealerValue}`]);
                break;
            }
            default: break;
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result]);

    const end = useCallback(() => {
        getResult();
        setTimeout(() => {
            setResult("");
            setGameStarted(false);
            setPlayerTurn(false);
            setDealerTurn(false);
            dispatch(clearCards({ target: "player" }));
            dispatch(clearCards({ target: "game" }));
        }, 3000);

    }, [getResult, dispatch]);

    useEffect(() => {
        if (busted(playerValue) || busted(dealerValue))
            end();
        if (blackJack(playerValue) || blackJack(dealerValue))
            end();
    }, [playerValue, dealerValue, end]);



    return (
        <BlackJackContext.Provider value={{
            start, end, history,
            gameStarted, setGameStarted,
            betValue, setBetValue,
            winner: result, setWinner: setResult,
            playerTurn, setPlayerTurn,
            dealerTurn, setDealerTurn,
            playerValue, dealerValue
        }}>
            <h1>BlackJack | 21</h1>
            <div className="BlackJack">

                <Controls />
                <Game />
                <History />

            </div>
        </BlackJackContext.Provider>
    );


}

export default BlackJack;