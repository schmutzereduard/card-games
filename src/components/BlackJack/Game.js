import { useContext } from "react";
import { useSelector } from "react-redux";
import { BlackJackContext } from "./BlackJack";

function Game() {

    const { playerCards, gameCards } = useSelector((state) => state.deck);
    const { playerValue, dealerValue, gameStarted } = useContext(BlackJackContext);

    return (
        <div className="Cards">
            {gameStarted && <h2>Player: {playerValue} | Dealer: {dealerValue}</h2>}
            <div className="Dealer">
                {gameStarted && gameCards.map((card, index) =>
                    <img
                        key={index}
                        src={card.image}
                        alt={`${card.code} of ${card.suit}`}
                    />
                )}
            </div>
            <div className="Player">
                {gameStarted && playerCards.map((card, index) =>
                    <img
                        key={index}
                        src={card.image}
                        alt={`${card.code} of ${card.suit}`}
                    />
                )}
            </div>
        </div>
    );
}

export default Game;