import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paytable from './Paytable';

function Poker() {
  const { deck, isLoading, error } = useSelector((state) => state.deck);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Poker Game</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {deck && <p>Deck ID: {deck.deck_id}</p>}
      <Paytable bet="50" />
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
}

export default Poker;
