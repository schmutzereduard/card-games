import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import './Home.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDeck } from '../features/deckSlice';
import ProfileModal from '../components/ProfileModal/ProfileModal';

function Home() {

    const deckId = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    useEffect(() => {
        deckId.current.focus();
        console.log(deckId.current.value);
    }, []);

    const handleNavigate = (path) => {

        if (deckId.current.value !== "") {
            
        } else {
            dispatch(fetchDeck());
        }
        navigate(path);
    };

    return (
        <div className='Home'>
            <h1>React Mini Card Games</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <input ref={deckId} placeholder='Already have a deck id ?'></input>
            <button onClick={() => setProfileModalOpen(true)}>Profile</button>
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
            <button onClick={() => handleNavigate("/poker")}>Poker</button>
            <button onClick={() => handleNavigate("/blackjack")}>BlackJack</button>
        </div>
    );
}

export default Home;