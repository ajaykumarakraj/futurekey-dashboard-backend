import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../component/AuthContext'; // ✅ import context
import '../app.css'; // 👈 custom CSS

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const mobile = location.state?.mobile;
    const { login } = useAuth(); // ✅ use auth context

    useEffect(() => {
        if (!mobile) {
            navigate('/');
        }
    }, [mobile, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://api.almonkdigital.in/api/verify-login-otp', {
                mobile,
                otp,
            });

            if (res.data.status === 200 &&  res.data.data.role=="Admin") {
                console.log(res.data.data.role)
                const token = res.data.token;
                const user = res.data.data;

                login({ user, token });

                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(user));

                navigate('/dashboard');
            } else {
                setError(res.data.message || 'Invalid OTP');
            }
        } catch (error) {
            setError('Error verifying OTP. Please try again.');
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-box">
                <h2>Verify OTP</h2>
                <p className="mobile-info">OTP sent to: <strong>{mobile}</strong></p>

                <form onSubmit={handleSubmit} className='verify'>
                    <label htmlFor="otp" style={{ display: "block" }}>Enter OTP</label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        required
                    />

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className='btnverify'>Verify</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
