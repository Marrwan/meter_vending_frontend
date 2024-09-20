import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCopy } from 'react-icons/fa'; // Import copy icon
import './App.css';
import { BASE_URL } from "./base";


function App() {
    const [meterCode, setMeterCode] = useState('');
    const [amount, setAmount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tokenData, setTokenData] = useState({ token: '', unit: '' });

    const handleRecharge = async () => {
        try {
            const response = await axios.post(BASE_URL + '/meter/recharge', {
                meterCode,
                amount,
            });

            const { token, unit } = response.data;

            setTokenData({ token, unit });
            setShowModal(true);

        } catch (error) {

            if (error.response && error.response.status === 400) {
                const { errors } = error.response.data;
                errors.forEach((errMsg) => toast.error(errMsg));
            } else {
                // Generic error message
                toast.error('Error processing your request. Please try again.');
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Token copied to clipboard!');
        }, () => {
            toast.error('Failed to copy token.');
        });
    };

    return (
        <div className="app-container">
            <div className="form-container">
                <h1>Meter Vending</h1>
                <p>Enter your meter code and the amount to recharge</p>
                <input
                    type="text"
                    placeholder="Enter Meter Code"
                    value={meterCode}
                    onChange={(e) => setMeterCode(e.target.value)}
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleRecharge} className="recharge-button">
                    Recharge
                </button>
            </div>

            {/* Modal to show token and unit */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Recharge Successful!</h2>
                        <p>Your token: <strong>{tokenData.token}</strong>
                            <FaCopy
                                onClick={() => copyToClipboard(tokenData.token)}
                                style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue' }}
                                title="Copy Token"
                            />
                        </p>
                        <p>You have purchased <strong>{tokenData.unit}</strong> kWh</p>
                        <button className="close-button" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Toast notifications */}
            <ToastContainer />
        </div>
    );
}

export default App;
