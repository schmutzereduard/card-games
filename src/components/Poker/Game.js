import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { drawCards } from "../../features/deckSlice"; // Make sure this path is correct

function Game() {
    const dispatch = useDispatch();  // Add useDispatch
    const deck = useSelector((state) => state.deck);
    const [selectedCards, setSelectedCards] = useState(0);

    useEffect(() => {
        console.log(deck);
    }, [deck]);

    const handleButtonClick = () => {
        // Dispatch the thunk instead of calling it directly
        dispatch(drawCards({ deckId: deck.deck.deck_id, count: 5, target: "game" }));    };

    return (
        <div id="game-wrapper">
            <button onClick={handleButtonClick}>DRAW</button>
        </div>
    );
}

export default Game;
