import  { useState } from 'react';

const FoodVerify = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handleVerifyOtp = async () => {
        const verifyData = { email, otp };
        
        try {
            const response = await fetch('http://localhost:8000/api/food/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(verifyData)
            });
            const data = await response.json();
            if (response.ok) {
                alert('OTP verified successfully!');
            } else {
                alert(data.message || 'Failed to verify OTP.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
    );
};

export default FoodVerify;
