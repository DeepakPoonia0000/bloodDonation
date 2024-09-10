import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminLogSign = ({ setAdminToken }) => {
    const [phoneNumber, setphoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {

        try {
            const response = await axios.post('http://localhost:7000/adminLogin', { phoneNumber, password });
            localStorage.setItem('adminToken', response.data.token);
            setAdminToken(response.data.token);
            console.log(response);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    return (
        <div className='main-container'>
            <div className="auth-container">
                <div className="form-container">
                    <input type="number" name="phone" id="number" placeholder='Phone Number' onChange={(e) => setphoneNumber(e.target.value)} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="button-container">
                        <button onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogSign