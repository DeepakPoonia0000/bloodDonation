import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: ''
        },
        contact: {
            phone: '',
            email: ''
        },
        coordinates: {
            latitude: '',
            longitude: ''
        },
        hasBloodDonationCenter: false,
        bloodTypes: [],
        operatingHours: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
        },
        facilities: [],
        website: '',
        specialInstructions: '',
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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                [name]: value
            }
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

    const handleCoordinatesChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            coordinates: {
                ...prevState.coordinates,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:7000/hospitalSignup', formData);
            localStorage.setItem('hospitalToken', response.data.token); // Store the token
            alert('Signup successful!');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            {error && <p>{error}</p>}
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Hospital Name" required />
            <input type="text" name="address.street" value={formData.address.street} onChange={handleAddressChange} placeholder="Street" required />
            <input type="text" name="address.city" value={formData.address.city} onChange={handleAddressChange} placeholder="City" required />
            <input type="text" name="address.state" value={formData.address.state} onChange={handleAddressChange} placeholder="State" required />
            <input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleAddressChange} placeholder="Postal Code" required />
            <input type="text" name="contact.phone" value={formData.contact.phone} onChange={handleContactChange} placeholder="Phone" required />
            <input type="email" name="contact.email" value={formData.contact.email} onChange={handleContactChange} placeholder="Email" required />
            <input type="number" name="coordinates.latitude" value={formData.coordinates.latitude} onChange={handleCoordinatesChange} placeholder="Latitude" required />
            <input type="number" name="coordinates.longitude" value={formData.coordinates.longitude} onChange={handleCoordinatesChange} placeholder="Longitude" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
            <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Special Instructions"></textarea>
            <button type="submit">Signup</button>
        </form>
    );
};

export default SignupForm;
