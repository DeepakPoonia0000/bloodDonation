import React, { useState } from 'react';
import axios from 'axios';

const HospitalLoginForm = () => {
    const [formData, setFormData] = useState({
        contact: {
            phone: '',
            email: ''
        },
        password: ''
    });
    
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            contact: {
                ...prevState.contact,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:7000/loginHospital', formData);
            localStorage.setItem('hospitalToken', response.data.token); // Store the token
            alert('Login successful!');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <input type="text" name="contact.phone" value={formData.contact.phone} onChange={handleContactChange} placeholder="Phone" required />
            <input type="email" name="contact.email" value={formData.contact.email} onChange={handleContactChange} placeholder="Email" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default HospitalLoginForm;
