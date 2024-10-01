import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../utils/LocalStorage';
import ProfileModal from '../components/ProfileModal/ProfileModal';
import logo from '../logo.svg';
import './Home.css';

function Home() {

    const profile = getProfile();
    const navigate = useNavigate();
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

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

                {profile ? ( 
                <div className="games-wrapper">
                    <h2>Games:</h2>
                    <button onClick={() => navigate("/five-card-draw")}>Five Card Draw</button>
                    <button onClick={() => navigate("/blackjack")}>BlackJack</button>
                </div>) : (
                    <p>Please create a profile</p>
                )}
            </div>
        </div>
    );
}

export default Home;