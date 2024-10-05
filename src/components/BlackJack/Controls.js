import { useEffect, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlackJackContext } from "./BlackJack";
import { getProfile } from "../../utils/LocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { drawCards } from "../../features/deckSlice";
import { busted } from "./Utils";



const buttonsHoverState = {
    start: false,
    hit: false,
    stand: false,
    doubleDown: false,
    split: false,
    home: false
};

function buttonHoverReducer(state, action) {
    switch (action.type) {
        case 'HOVER_ON':
            return { ...state, [action.button]: true };
        case 'HOVER_OFF':
            return { ...state, [action.button]: false };
        default:
            return state;
    }
}

function Controls() {

    const profile = getProfile();
    const navigate = useNavigate();
    const reduxDispatch = useDispatch();
    const { deck, playerCards } = useSelector((state) => state.deck);
    const { start, end, gameStarted, setGameStarted, playerTurn, setPlayerTurn, playerValue, daalerValue } = useContext(BlackJackContext);
    const [betAlert, setBetAlert] = useState("");
    const [controlTips, setControlTips] = useState("");
    const [buttonsState, buttonsDispatch] = useReducer(buttonHoverReducer, buttonsHoverState);

    useEffect(() => {
        if (buttonsState.start) {
            setControlTips(gameStarted ? "Forfeit half the bet and end the round" : "Start the game");
        } else if (buttonsState.hit) {
            setControlTips("Draw another card to get closer to 21");
        } else if (buttonsState.stand) {
            setControlTips("Keep the current total and end the turn");
        } else if (buttonsState.doubleDown) {
            setControlTips("Double the initial bet, draw exactly one more card, and then stand");
        } else if (buttonsState.split) {
            setControlTips("Split the cards into two separate hands, doubling the bet");
        } else if (buttonsState.home) {
            setControlTips("Go back to the home page");
        } else {
            setControlTips("");
        }
    }, [gameStarted, buttonsState]);

    const handleStartButton = () => {
        if (!gameStarted)
            start();
        else
            end();
    }

    

    const handleButtonHoverOn = (button) => {
        buttonsDispatch({ type: "HOVER_ON", button: button });
    }

    const handleButtonHoverOff = (button) => {
        buttonsDispatch({ type: "HOVER_OFF", button: button });
    }

    const hit = () => {
        reduxDispatch(drawCards({ deckId: deck.deck_id, count: 1, target: "player" }));
    }

    const stand = () => {
        setPlayerTurn(false);
    }

    const doubleDown = () => {
        hit();
        stand();
    }

    const canSplit = () => {

        let uniqueCard = null;

        for (let card of playerCards) {
            if (uniqueCard === null)
                uniqueCard = card.value;
            else if (card.value !== uniqueCard)
                return false;
        }

        return true;
    }

    return (
        <div className="Controls">
            <h2>Controls</h2>
            <label>Funds: {profile.funds}$</label>
            <div className="Bet-Wrapper">
                <p>{betAlert}</p>
                <label>Bet: </label>
                <input disabled={gameStarted} placeholder="Place your bet..." />
            </div>
            <div className="Controls-Wrapper">
            <p>{controlTips}</p>
                <button
                    onMouseEnter={() => handleButtonHoverOn("start")}
                    onMouseLeave={() => handleButtonHoverOff("start")}
                    className={gameStarted ? "red-button" : ""}
                    onClick={handleStartButton}>
                        {gameStarted ? "Surrender" : "Start"}
                </button>
                <button
                    onMouseEnter={() => handleButtonHoverOn("hit")}
                    onMouseLeave={() => handleButtonHoverOff("hit")}
                    onClick={hit}
                    hidden={!gameStarted}
                    disabled={busted(playerValue) || !playerTurn}>
                        Hit
                </button>
                <button
                    onMouseEnter={() => handleButtonHoverOn("stand")}
                    onMouseLeave={() => handleButtonHoverOff("stand")}
                    onClick={stand}
                    hidden={!gameStarted}
                    disabled={busted(playerValue) || !playerTurn}>
                        Stand
                </button>
                <button
                    hidden={!gameStarted}
                    onMouseEnter={() => handleButtonHoverOn("doubleDown")}
                    onMouseLeave={() => handleButtonHoverOff("doubleDown")}
                    onClick={doubleDown}
                    disabled={busted(playerValue) || !playerTurn}>
                        Double Down
                </button>
                <button
                    hidden={!gameStarted}
                    disabled={busted(playerValue) || !canSplit() || !playerTurn}
                    onMouseEnter={() => handleButtonHoverOn("split")}
                    onMouseLeave={() => handleButtonHoverOff("split")}>
                        Split
                </button>
                <button
                    onClick={() => navigate("/")}
                    onMouseEnter={() => handleButtonHoverOn("home")}
                    onMouseLeave={() => handleButtonHoverOff("home")}>
                        Home
                </button>
            </div>
        </div>
    );
}

export default Controls;