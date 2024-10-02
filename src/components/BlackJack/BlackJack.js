
import { createContext, useState } from 'react';
import './BlackJack.css';
import Controls from './Controls';
import Game from './Game';

export const BlackJackContext = createContext(null);

function BlackJack() {

    const [gameStarted, setGameStarted] = useState(false);

    return (
        <BlackJackContext.Provider value={{ gameStarted, setGameStarted }}>
            <h1>BlackJack | 21</h1>
            <div className="BlackJack">

                <Controls />
                <Game />


            </div>
        </BlackJackContext.Provider>
    );


}

export default BlackJack;