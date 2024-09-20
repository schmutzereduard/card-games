import { useContext, useRef } from "react";
import { PokerContext } from "./Poker";

function Betting() {

    const betRef = useRef(null);
    const profile = JSON.parse(sessionStorage.getItem("profileInfo"));
    const { bet, setBet, gameStarted, setGameStarted } = useContext(PokerContext);


    const handleButtonClick = () => {

        if (gameStarted) {
            setGameStarted(false);
        } else {
            validateBet() && setGameStarted(true);
        }
    }

    const handleInputChange = (event) => {
        setBet(event.target.value);
    }

    const validateBet = () => {

        const betValue = betRef.current.value;

        if (betValue === "") {
            alert("Bet value invalid !");
            return false;
        }

        if (betValue.startsWith("0")) {
            alert("Bet cannot start with 0 !");
            return false;
        }

        if (betValue < -1) {
            alert("Bet value must be pozitive !");
            return false;
        }

        if (betValue > profile.funds) {
            alert("Insufficient funds !");
            return false;
        }

        return true;
    }

    return (
        <div id="controls-wrapper">
            <label>Funds: {profile.funds}$</label>
            <br />
            <input onChange={handleInputChange} ref={betRef} value= {bet} type="number" placeholder="Place your bet" disabled={gameStarted} />
            <br />
            <button onClick={handleButtonClick}>{gameStarted ? "End Game" : "Start Game"}</button>
        </div>
    );
}

export default Betting;