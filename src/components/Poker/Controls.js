import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { PokerContext } from "./Poker";
import { getProfile } from "../../utils/LocalStorage";
import { changeCards } from "../../features/deckSlice";
import ConfirmationModal from "../ProfileModal/ConfirmationModal";
import './Poker.css';

function Controls() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const betRef = useRef(null);
    const profile = getProfile();
    const deck = useSelector((state) => state.deck.deck);
    const { selectedCards, setSelectedCards, round, setRound, bet, setBet, gameStarted, start, end } = useContext(PokerContext);
    const [endGameModalOpen, setEndGameModalOpen] = useState(false);
    const [returnHomeModalOpen, setReturnHomeModalOpen] = useState(false);


    const handleStartButtonClick = () => {

        if (gameStarted) {
            setEndGameModalOpen(true);
        } else {
            validateBet() && start();
        }
    }
    
    const handleConfirmEndButtonClick = () => {
        setEndGameModalOpen(false);
        end();
    }

    const handleChangeClick = () => {
        setRound(round + 1);
        setSelectedCards([]);
        dispatch(changeCards({
            deckId: deck.deck_id,
            count: selectedCards.length,
            targetHand: "game",
            targetCards: selectedCards
        }));
    }

    const handleHomeButtonClick = () => {
        end();
        navigate("/");
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

    return profile ? (
        <div id="controls-wrapper">
            <h2>Controls</h2>
            <label>Funds: {profile.funds}$</label>
            <br />
            <input onChange={handleInputChange} ref={betRef} value= {bet} type="number" placeholder="Place your bet" disabled={gameStarted} />
            <br />
            <button id="start-game" className={gameStarted ? "red-button" : ""}onClick={handleStartButtonClick}>{gameStarted ? "End Game" : "Start Game"}</button>
            <ConfirmationModal message="Are you sure you want to end the game?" isOpen={endGameModalOpen} onConfirm={handleConfirmEndButtonClick} onClose={() => setEndGameModalOpen(false)} />
            <br />
            <button hidden={!gameStarted} onClick={handleChangeClick}>Change Cards</button>
            <br />
            <button id="home" onClick={() => setReturnHomeModalOpen(true)}>Home</button>
            <ConfirmationModal message="Are you sure you want to go Home? This will end your current game" isOpen={returnHomeModalOpen} onConfirm={handleHomeButtonClick} onClose={() => setReturnHomeModalOpen(false)} />
        </div>
    ) : null;
}

export default Controls;