import { useEffect, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlackJackContext } from "./BlackJack";
import { getProfile } from "../../utils/LocalStorage";

const buttonsHoverState = {
    start: false,
    surrender: false,
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
    const { gameStarted, setGameStarted } = useContext(BlackJackContext);
    const [betAlert, setBetAlert] = useState("");
    const [controlTips, setControlTips] = useState("");
    const [state, dispatch] = useReducer(buttonHoverReducer, buttonsHoverState);

    useEffect(() => {
        if (state.start) {
            setControlTips("Start the game");
        } else if (state.surrender) {
            setControlTips("Forfeit half the bet and end the round");
        } else if (state.hit) {
            setControlTips("Draw another card to get closer to 21");
        } else if (state.stand) {
            setControlTips("Keep the current total and end the turn");
        } else if (state.doubleDown) {
            setControlTips("Double the initial bet, draw exactly one more card, and then stand");
        } else if (state.split) {
            setControlTips("Split the cards into two separate hands, doubling the bet");
        } else if (state.home) {
            setControlTips("Go back to the home page");
        } else {
            setControlTips("");
        }
    }, [state]);

    const handleStartButton = () => {
        if (!gameStarted)
            start();
        else
            end();
    }

    const start = () => {
        setGameStarted(true);
    }

    const end = () => {
        setGameStarted(false);
    }

    const handleButtonHoverOn = (button) => {
        dispatch({ type: "HOVER_ON", button: button });
    }

    const handleButtonHoverOff = (button) => {
        dispatch({ type: "HOVER_OFF", button: button });
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
                    onMouseEnter={() => handleButtonHoverOn(gameStarted ? "surrender" : "start")}
                    onMouseLeave={() => handleButtonHoverOff(gameStarted ? "surrender" : "start")}
                    className={gameStarted ? "red-button" : ""}
                    onClick={handleStartButton}>
                        {gameStarted ? "Surrender" : "Start"}
                </button>
                <button
                    onMouseEnter={() => handleButtonHoverOn("hit")}
                    onMouseLeave={() => handleButtonHoverOff("hit")}
                    hidden={!gameStarted}>
                        Hit
                </button>
                <button
                    onMouseEnter={() => handleButtonHoverOn("stand")}
                    onMouseLeave={() => handleButtonHoverOff("stand")}
                    hidden={!gameStarted}>
                        Stand
                </button>
                <button
                    hidden={!gameStarted}
                    onMouseEnter={() => handleButtonHoverOn("doubleDown")}
                    onMouseLeave={() => handleButtonHoverOff("doubleDown")}>
                        Double Down
                </button>
                <button
                    hidden={!gameStarted}
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