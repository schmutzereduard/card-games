import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { PokerContext } from "./Poker";
import { getProfile } from "../../utils/LocalStorage";
import { changeCards } from "../../features/deckSlice";
import ConfirmationModal from "../ProfileModal/ConfirmationModal";
import './Poker.css';

function Controls() {

    const profile = getProfile();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const betRef = useRef(null);
    const deck = useSelector((state) => state.deck.deck);
    const { selectedCards, setSelectedCards, round, setRound, bet, setBet, gameStarted, start, end } = useContext(PokerContext);
    const [endModalOpen, setEndModalOpen] = useState(false);
    const [homeModalOpen, setHomeModalOpen] = useState(false);
    const [alert, setAlert] = useState("");


    const handleStartButtonClick = () => {

        if (gameStarted) {
            setEndModalOpen(true);
        } else {
            validateBet() && start();
        }
    }
    
    const handleConfirmEndButtonClick = () => {
        setEndModalOpen(false);
        end();
    }

    const handleChangeButtonClick = () => {
        dispatch(changeCards({
            deckId: deck.deck_id,
            count: selectedCards.length,
            targetHand: "game",
            targetCards: selectedCards
        }));
        setRound(round + 1);
        setSelectedCards([]);
    }

    const handleHomeButtonClick = () => {
        end();
        navigate("/");
    }

    const handleBetInputChange = (event) => {
        setBet(event.target.value);
    }

    const validateBet = () => {

        const betValue = betRef.current.value;

        if (betValue === "") {
            setAlert("Bet value invalid !");
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

    return (
        <div id="controls-wrapper">
            <h2>Controls</h2>
            {alert !== "" && <p>{alert}</p>}
            <label>Funds: {profile.funds}$</label>
            <br />
            <input onChange={handleBetInputChange} ref={betRef} value= {bet} type="number" placeholder="Place your bet" disabled={gameStarted} />
            <br />
            <button hidden={round === 3} id="start-game" className={gameStarted ? "red-button" : ""}onClick={handleStartButtonClick}>{gameStarted ? "End Game" : "Start Game"}</button>
            <ConfirmationModal message="Are you sure you want to end the game?" isOpen={endModalOpen} onConfirm={handleConfirmEndButtonClick} onClose={() => setEndModalOpen(false)} />
            <br />
            <button hidden={!gameStarted || round === 3 || selectedCards.length === 0} onClick={handleChangeButtonClick}>Change Cards</button>
            <br />
            <button hidden={round ===3} id="home" onClick={gameStarted ? () => setHomeModalOpen(true) : () => navigate("/")}>Home</button>
            <ConfirmationModal message="Are you sure you want to go Home? This will end your current game" isOpen={homeModalOpen} onConfirm={handleHomeButtonClick} onClose={() => setHomeModalOpen(false)} />
        </div>
    );
}

export default Controls;