import { useEffect, useContext, useReducer, useState, useRef, useCallback } from "react";
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
    const { start, end, gameStarted, playerTurn, setPlayerTurn, playerValue, dealerTurn, setDealerTurn, dealerValue, betValue, setBetValue } = useContext(BlackJackContext);
    const [alert, setAlert] = useState("");
    const [buttonsState, buttonsDispatch] = useReducer(buttonHoverReducer, buttonsHoverState);
    const betRef = useRef(null);

    useEffect(() => {
        if (buttonsState.start) {
            setAlert(gameStarted ? "Forfeit half the bet and end the round" : "Start the game");
        } else if (buttonsState.hit) {
            setAlert("Draw another card to get closer to 21");
        } else if (buttonsState.stand) {
            setAlert("Keep the current total and end the turn");
        } else if (buttonsState.doubleDown) {
            setAlert("Double the initial bet, draw exactly one more card, and then stand");
        } else if (buttonsState.split) {
            setAlert("Split the cards into two separate hands, doubling the bet");
        } else if (buttonsState.home) {
            setAlert("Go back to the home page");
        } else {
            setAlert("");
        }
    }, [gameStarted, buttonsState]);

    const handleStartButton = () => {
        if (!gameStarted)
            validateBet() && start();
        else
            end();
    }

    const validateBet = () => {

        const betValue = betRef.current.value;

        if (betValue === "") {
            setAlert("Bet empty !");
            return false;
        }

        if (betValue.startsWith("0")) {
            setAlert("Bet cannot start with 0 !");
            return false;
        }

        if (betValue < -1) {
            setAlert("Bet value must be pozitive !");
            return false;
        }

        if (betValue > profile.funds) {
            setAlert("Insufficient funds !");
            return false;
        }

        setAlert("");
        return true;
    }

    const handleButtonHoverOn = (button) => {
        buttonsDispatch({ type: "HOVER_ON", button: button });
    }

    const handleButtonHoverOff = (button) => {
        buttonsDispatch({ type: "HOVER_OFF", button: button });
    }

    const hit = useCallback((target) => {
        reduxDispatch(drawCards({ deckId: deck.deck_id, count: 1, target: target }));
    }, [deck, reduxDispatch]);

    const stand = useCallback((target) => {
        if (target === "player") {
            setPlayerTurn(false);
            setDealerTurn(true);
        } else if (target === "game") {
            setDealerTurn(false);
        }
    }, [setPlayerTurn, setDealerTurn]);

    const doubleDown = () => {
        setBetValue(betValue * 2);
        hit("player");
        stand("player");
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

    const canDoubleDown = () => {
        return betValue * 2 < profile.funds;
    }

    const dealerAutoPlay = useCallback(() => {
        if (dealerValue <= 16)
            hit("game");
        if (dealerValue >= 17) {
            stand("game");
            end();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerValue, hit, stand]);

    useEffect(() => {
        if (dealerTurn)
            dealerAutoPlay();
    }, [dealerTurn, dealerAutoPlay]);

    return (
        <div className="Controls">
            <h2>Controls</h2>
            <label>Funds: {profile.funds}$</label>
            <div className="Bet-Wrapper">
                <label>Bet: </label>
                <input
                    ref={betRef}
                    type="number"
                    value={betValue}
                    disabled={gameStarted}
                    placeholder="Place your bet..."
                    onChange={(event) => setBetValue(event.target.value)} />
            </div>
            <div className="Alert-Wrapper">
                <p>{alert}</p>
            </div>
            <div className="Controls-Wrapper">

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
                    onClick={() => hit("player")}
                    hidden={!gameStarted}
                    disabled={busted(playerValue) || !playerTurn}>
                    Hit
                </button>
                <button
                    onMouseEnter={() => handleButtonHoverOn("stand")}
                    onMouseLeave={() => handleButtonHoverOff("stand")}
                    onClick={() => stand("player")}
                    hidden={!gameStarted}
                    disabled={busted(playerValue) || !playerTurn}>
                    Stand
                </button>
                <button
                    hidden={!gameStarted}
                    onMouseEnter={() => handleButtonHoverOn("doubleDown")}
                    onMouseLeave={() => handleButtonHoverOff("doubleDown")}
                    onClick={doubleDown}
                    disabled={busted(playerValue) || !canDoubleDown() || !playerTurn}>
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