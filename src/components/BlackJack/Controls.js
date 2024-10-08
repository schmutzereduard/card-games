import { useEffect, useContext, useReducer, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BlackJackContext } from "./BlackJack";
import { getProfile } from "../../utils/LocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { drawCards } from "../../features/deckSlice";
import { blackJack, busted } from "./Utils";

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
    
    const betRef = useRef(null);
    const [alert, setAlert] = useState("");
    const [forfeit, setForfeit] = useState(false);
    const [buttonsState, buttonsDispatch] = useReducer(buttonHoverReducer, buttonsHoverState);

    useEffect(() => {
        betRef.current.focus();
    }, []);

    useEffect(() => {
        if (!gameStarted)
            setForfeit(false);
    }, [gameStarted]);

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

    const startGame = () => {
        validateBet() && start();
    }

    const surrender = () => {
        setForfeit(true);
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
        setTimeout(() => {
            stand("player");
        }, 1000);
    };

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
        if (busted(playerValue))
            return;
        if (dealerValue < 17) {
            hit("game");
        } else {
            stand("game");
            end();
        }
    }, [playerValue, dealerValue, hit, stand, end]);

    useEffect(() => {
        if (dealerTurn)
            dealerAutoPlay();
    }, [dealerTurn, dealerValue, dealerAutoPlay]);

    const buttonDisabled = () => {
        return forfeit || (gameStarted && !playerTurn) || dealerTurn || busted(playerValue) || blackJack(playerValue);
    }

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
                    onClick={gameStarted ? surrender : startGame}
                    disabled={buttonDisabled()}>
                    {gameStarted ? "Surrender" : "Start"}
                </button>
                <button
                    onMouseEnter={() => handleButtonHoverOn("hit")}
                    onMouseLeave={() => handleButtonHoverOff("hit")}
                    onClick={() => hit("player")}
                    hidden={!gameStarted}
                    disabled={buttonDisabled()}>
                    Hit
                </button>
                <button
                    onMouseEnter={() => handleButtonHoverOn("stand")}
                    onMouseLeave={() => handleButtonHoverOff("stand")}
                    onClick={() => stand("player")}
                    hidden={!gameStarted}
                    disabled={buttonDisabled()}>
                    Stand
                </button>
                <button
                    hidden={!gameStarted}
                    onMouseEnter={() => handleButtonHoverOn("doubleDown")}
                    onMouseLeave={() => handleButtonHoverOff("doubleDown")}
                    onClick={doubleDown}
                    disabled={buttonDisabled() || !canDoubleDown()}>
                    Double Down
                </button>
                <button
                    hidden={!gameStarted}
                    disabled={buttonDisabled() || !canSplit()}
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