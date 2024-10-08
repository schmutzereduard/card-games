import { useContext } from "react";
import { BlackJackContext } from "./BlackJack";

function History() {

    const { history } = useContext(BlackJackContext);

    return (
        <div className="History">
            <h2>History</h2>
            <ol className="History-List">
                {history.map((item, index) => <li key={index}>{item}</li>)}
            </ol>
        </div>
    );
}

export default History;