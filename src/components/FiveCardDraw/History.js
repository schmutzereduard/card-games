import { useContext } from "react";
import { FiveCardDrawContext } from "./FiveCardDraw";

function History() {

    const { history } = useContext(FiveCardDrawContext);

    return (history.length > 0 &&
        <div id="history">
            <h2>History</h2>
            <ol>
                {history.map((hand, index) =>
                    <li key={index}>{hand}</li>)}
            </ol>
        </div>
    );
}

export default History;