import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { changeCards } from "../../features/deckSlice";
import { PokerContext } from "./Poker";
import { CARD_BACK_URL } from "../../Constants";

function Game() {
    const dispatch = useDispatch();
    const { gameStarted, round, setRound } = useContext(PokerContext);
    const [selectedCards, setSelectedCards] = useState([]);
    const deck = useSelector((state) => state.deck.deck);
    const gameCards = useSelector((state) => state.deck.gameCards);

    useEffect(() => {
        if (!gameStarted) {
            setSelectedCards([]);
        }
    }, [gameStarted]);

    const handleCardClick = (card) => {
        setSelectedCards((prevSelected) => {
            if (prevSelected.includes(card)) {
                return prevSelected.filter(selectedCard => selectedCard.code !== card.code); // Remove the card if already selected
            } else if (prevSelected.length < 3) {
                return [...prevSelected, card]; // Add the card if not selected
            } else {
                return [...prevSelected];
            }
        });
    };

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

    return (
        <div id="game-wrapper">
            {gameStarted && <h2>Round: {round}</h2>}
            <button hidden={!gameStarted} onClick={handleChangeClick}>Change</button>
            {gameCards.map((card, index) => {
                const isSelected = selectedCards.some(selectedCard => selectedCard.code === card.code);
                return (
                    <img
                        key={index}
                        src={isSelected ? CARD_BACK_URL : card.image}
                        alt={`${card.code} of ${card.suit}`}
                        onClick={() => handleCardClick(card)}
                    />
                );
            })}
        </div>
    );
}

export default Game;
