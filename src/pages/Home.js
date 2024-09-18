import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import './Home.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDeck, shuffleDeck } from '../features/deckSlice';
import ProfileModal from '../components/ProfileModal/ProfileModal';

function Home() {

    const deckIdRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    useEffect(() => {
        deckIdRef.current.focus();
        console.log(deckIdRef.current.value);
    }, []);

    const handleNavigate = (path) => {

        const deckId = deckIdRef.current.value;

        if (deckId !== "") {
            dispatch(shuffleDeck(deckId));
        } else {
            dispatch(fetchDeck());
        }
        navigate(path);
    };

    return (
        <div className='Home'>
            <h1>React Mini Card Games</h1>
            <img src={logo} className="App-logo" alt="logo" />

            <div className="input-wrapper">
                <img 
                    src={sessionStorage.getItem("profileInfo") ? "profile.svg" : "create-profile.svg"}
                    alt="Profile" 
                    className="profile-icon" 
                    onClick={() => setProfileModalOpen(true)} 
                />

                <input ref={deckIdRef} placeholder='Already have a deck id?' />
            </div>

            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />

            <h2>Games:</h2>
            <button onClick={() => handleNavigate("/poker")}>Poker</button>
            <button onClick={() => handleNavigate("/blackjack")}>BlackJack</button>
        </div>
    );
}

export default Home;