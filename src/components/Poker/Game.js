import { useContext } from "react";
import { useSelector } from 'react-redux';
import { PokerContext } from "./Poker";
import { CARD_BACK_URL } from "../../Constants";

function Game() {
    const { gameStarted, round, lastGame, selectedCards, setSelectedCards } = useContext(PokerContext);
    const gameCards = useSelector((state) => state.deck.gameCards);

    const handleCardClick = (card) => {
        round < 3 && setSelectedCards((prevSelected) => {
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
            {gameStarted && round < 3 && <h2>Round: {round} | Select up to 3 cards | Selected: {selectedCards.length}</h2>}
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
            {!gameStarted && lastGame.length === 0 && gameCards.length > 0 && (
              <h2>Displaying Final Cards</h2>
            )}
          </div>
      
          {/* Ensure that lastGame persists after the game ends */}
          <div id="last-game">
            {!gameStarted && lastGame.length > 0 && <h2>Last Game</h2>}
            {!gameStarted && lastGame.length > 0 && lastGame.map((card, index) =>
              <img
                key={index}
                src={card.image}
                alt={`${card.code} of ${card.suit}`}
              />)}
          </div>
        </div>
      );
}

export default Game;
