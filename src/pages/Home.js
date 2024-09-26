import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDeck } from '../features/deckSlice';
import { getProfile } from '../utils/LocalStorage';
import ProfileModal from '../components/ProfileModal/ProfileModal';
import logo from '../logo.svg';
import './Home.css';

function Home() {

    const profile = getProfile();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    const handleNavigate = (path) => {
        if (!profile.deckId)
            dispatch(fetchDeck());

        navigate(path);
    }

    return (
        <div className='Home'>
            <h1>React Mini Card Games</h1>
            <img src={logo} className="App-logo" alt="logo" />

            <div className='home-controls'>
                <img
                    src={profile ? "profile.svg" : "create-profile.svg"}
                    alt="Profile"
                    className="profile-icon"
                    onClick={() => setProfileModalOpen(true)}
                />

                <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />

                {profile && 
                <div className="games-wrapper">
                    <h2>Games:</h2>
                    <button onClick={() => handleNavigate("/poker")}>Poker</button>
                    <button onClick={() => handleNavigate("/blackjack")}>BlackJack</button>
                </div>}
            </div>
        </div>
    );
}

export default Home;