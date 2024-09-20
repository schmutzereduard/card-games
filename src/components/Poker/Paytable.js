import { useContext } from "react";
import { HANDS } from "./Hands";
import { PokerContext } from "./Poker";


function Paytable() {

    const { bet } = useContext(PokerContext);

    return (
        <div id="paytable-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Hand</th>
                        <th>Pay</th>
                    </tr>
                </thead>
                <tbody>
                    {HANDS.map((hand, index) => (
                        <tr key={index}>
                            <td>{hand.name}</td>
                            <td>{bet * hand.multiplier}$</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Paytable;