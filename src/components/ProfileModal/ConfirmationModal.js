function ConfirmationModal({ isOpen, onConfirm, onClose }) {

    if (!isOpen) return null;


    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <p>Are you sure?</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onClose}>No</button>
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

export default ConfirmationModal;