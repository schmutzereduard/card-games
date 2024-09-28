import { useContext } from "react";
import { useSelector } from 'react-redux';
import { PokerContext } from "./Poker";
import { CARD_BACK_URL } from "../../Constants";

function Game() {
    const { gameStarted, round, lastGame, selectedCards, setSelectedCards } = useContext(PokerContext);
    const gameCards = useSelector((state) => state.deck.gameCards);

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

    return (
        <div id="game-wrapper">
            <div id="current-game">
                {gameStarted && <h2>Round: {round}</h2>}
                {gameStarted && gameCards.map((card, index) => {
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
            <div id="last-game">
                {lastGame.length > 0 && <h2>Last Game</h2>}
                {lastGame.length > 0 && lastGame.map((card, index) =>
                    <img
                        key={index}
                        src={card.image}
                        alt={`${card.code} of ${card.suit}`}
                        onClick={() => handleCardClick(card)}
                    />)}
            </div>
        </div>
    );
}

export default Game;
