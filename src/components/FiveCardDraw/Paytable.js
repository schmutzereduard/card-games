import { useContext } from "react";
import { HANDS } from "./Hands";
import { FiveCardDrawContext } from "./FiveCardDraw";
import './FiveCardDraw';

function Paytable() {

    const { bet } = useContext(FiveCardDrawContext);

    return (
        <div className="Paytable">
            <h2>Paytable</h2>
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