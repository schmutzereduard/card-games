import { HANDS } from "./Hands";


function Paytable({ bet }) {

    return (
        <table className="poker-paytable">
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
    );
}

export default Paytable;