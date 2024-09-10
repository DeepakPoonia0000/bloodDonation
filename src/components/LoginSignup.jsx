import React, {  useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles/LoginSignup.css'

const LoginSignup = ({setToken}) => {
    const [phoneNumber, setphoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    // const [location, setLocation] = useState({
    //     longitude: "",
    //     latitude: ""
    // });

    // const validateEmail = (email) => {
    //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return re.test(email);
    // };

    const handleLogin = async () => {
        
        try {
            const response = await axios.post('http://localhost:7000/loginUser', { phoneNumber, password });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            console.log(response);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:7000/addUser', { phoneNumber, password , bloodGroup });
            console.log(response.data.newUser);

        } catch (error) {
            console.error('Signup failed:', error);
        }
        handleLogin();
    };    

    return (
        <div className='main-container'>
            <div className="auth-container">
                <div className="form-container">

                    <input type="number" name="phone" id="number" placeholder='Phone Number' onChange={(e) => setphoneNumber(e.target.value)}/>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                        <option value="">Select Your Blood Group</option>
                        <option value="a+">A+</option>
                        <option value="a-">A-</option>
                        <option value="b+">B+</option>
                        <option value="b-">B-</option>
                        <option value="ab+">AB+</option>
                        <option value="ab-">AB-</option>
                        <option value="o+">O+</option>
                        <option value="o-">O-</option>
                        <option value="a2+">A2+</option>
                        <option value="a2-">A2-</option>
                        <option value="a2b+">A2B+</option>
                        <option value="a2b-">A2B-</option>
                        <option value="hh">HH (Bombay Blood Group)</option>
                        <option value="inra">INRA</option>
                    </select>
                    <div className="button-container">
                        <button onClick={handleLogin}>Login</button>
                        <button onClick={handleSignup}>Signup</button>
                    </div>
                </div>
            </div>
            <div>
                <Link to='bloodRequirement'><h2>Need Blood Immedietly</h2></Link>
            </div>
        </div>
    );
};

export default LoginSignup;
