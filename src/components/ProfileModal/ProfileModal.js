import { useEffect, useRef, useState } from "react";
import { deleteProfile, getProfile, saveProfile } from "../../utils/LocalStorage";
import { fetchDeck } from "../../features/deckSlice";
import { useDispatch, useSelector } from "react-redux";

function ProfileModal({ isOpen, onClose }) {

    if (!isOpen) return null;

    const profile = getProfile();

    return profile ? (<Profile profile={profile} onClose={onClose} />) : (<CreateProfile onClose={onClose} />);
}

function CreateProfile({ onClose }) {

    const dispatch = useDispatch();
    const { deck } = useSelector((state) => state.deck);
    const nameRef = useRef(null);
    const startingFundsRef = useRef(null);
    const deckIdRef = useRef(null);
    const [alert, setAlert] = useState("");

    useEffect(() => {
        nameRef.current.focus();
    }, []);

    const handleGenerateButtonClick = async () => {
        if (deck) { //Avoid spamming the API if user keeps logging out
            deckIdRef.current.value = deck.deck_id;
        } else {
            try {
                const response = await dispatch(fetchDeck()).unwrap();  // Unwrap the response to get the data
                deckIdRef.current.value = response.deck_id;  // Set the deck ID once the promise resolves
            } catch (error) {
                console.error("Failed to fetch deck:", error);
                setAlert("Failed to generate deck. Please try again.");
            }
        }
    };



    const handleCreateButtonClick = () => {
        const name = nameRef.current.value;
        const funds = startingFundsRef.current.value;
        const deckId = deckIdRef.current.value;

        if (name === "") {
            setAlert("Please enter a name!");
            return;
        }

        if (deckId === "") {
            setAlert("Please enter a Deck Id or generate one by pressing 'Deck ID'!")
            return;
        }

        const profileInfo = {
            name: name,
            funds: funds,
            deckId: deckId
        };

        setAlert("");
        saveProfile(profileInfo);
        onClose();
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <p>{alert}</p>
                <label>Name: </label>
                <input ref={nameRef} placeholder="Enter your name" />
                <br />

                <label>Funds: </label>
                <input value={100} disabled={true} ref={startingFundsRef} type="number" placeholder="Enter your starting funds" />
                <br />

                <label onClick={handleGenerateButtonClick}>Deck ID: </label>
                <input ref={deckIdRef} placeholder="Already have a Deck ID?" />
                <br />
                <br />

                <button onClick={handleCreateButtonClick}>Create</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

function Profile({ profile, onClose }) {

    const handleLogOutButtonClick = () => {
        deleteProfile();
        onClose();
    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h1>Hello {profile.name} !</h1>
                <br />
                <label>Funds: {profile.funds}$</label>
                <br />
                <label>Deck ID: {profile.deckId}</label>
                <br />
                <button onClick={onClose}>Close</button>
                <button onClick={handleLogOutButtonClick}>Log out</button>
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