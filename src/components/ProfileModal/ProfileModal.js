import { useEffect, useRef } from "react";

function ProfileModal({ isOpen, onClose }) {

    if (!isOpen) return null;

    const profile = JSON.parse(sessionStorage.getItem("profileInfo"));

    return profile ? (<Profile profile={profile} onClose={onClose} />) : (<CreateProfile onClose={onClose} />);
}

function CreateProfile({onClose}) {

    const nameRef = useRef(null);
    const startingFundsRef = useRef(null);

    useEffect(() => {
        nameRef.current.focus();
    }, []);


    const handleButtonClick = () => {
        const name = nameRef.current.value;
        const funds = startingFundsRef.current.value;
    
        if (name === "" || funds === "") {
            alert("Please enter a name and choose your starting funds!");
            return;
        }
    
        const fundsValue = parseInt(funds, 10);
        if (fundsValue < 1 || fundsValue > 100) {
            alert("Funds must be between 1 and 100!");
            return;
        }
    
        const profileInfo = {
            name: name,
            funds: fundsValue,
        };
    
        sessionStorage.setItem("profileInfo", JSON.stringify(profileInfo));
        onClose();
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <label>Name: </label>
                <input ref={nameRef} placeholder="Enter your name" />
                <br />

                <label>Funds: </label>
                <input ref={startingFundsRef} type="number" placeholder="Enter your starting funds"/>
                <br />

                <button onClick={handleButtonClick}>Create profile</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

function Profile({ profile, onClose }) {

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h1>Hello {profile.name} !</h1>
                <br />
                <label>Funds: {profile.funds}$</label>
                <br />
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '400px',
        textAlign: 'center',
    },
};

export default ProfileModal;