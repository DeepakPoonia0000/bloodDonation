import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './styles/BloodRequirement.css'

const BloodRequirement = () => {
    const [bloodGroup, setBloodGroup] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });
    const [successMessage, setSuccessMessage] = useState('');  

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        longitude,
                        latitude
                    });
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("Please enable location permissions for this app.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Location information is unavailable. Please try again later.");
                            break;
                        case error.TIMEOUT:
                            alert("The request to get your location timed out. Please try again.");
                            break;
                        case error.UNKNOWN_ERROR:
                            alert("An unknown error occurred. Please try again.");
                            break;
                            default:
                                console.log("There is no error is fetching location")
                    }
                }
            );
        } else {
            alert('Geolocation is not supported by this browser');
        }
    };

    const bloodRequest = async () => {
        const userData = { bloodGroup, location, phoneNumber };
        try {
            const response = await axios.post("http://localhost:7000/getRequest", userData);
            setSuccessMessage('Blood request sent successfully!');  
            console.log("response is this from =>",response.data);
        } catch (error) {
            console.error('Request failed:', error);
            setSuccessMessage('Failed to send blood request. Please try again.');  
        }
    };

    return (
        <div className="blood-request-form">
        <label htmlFor="bloodGroup" className="form-label">
          Enter the Blood Group in small case letters e.g., a+, b+, o-
        </label>
        <br />
        <input
          type="text"
          id="bloodGroup"
          placeholder="Blood Group"
          className="form-input"
          onChange={(e) => setBloodGroup(e.target.value)}
        />
        <br />
        <label htmlFor="phoneNumber" className="form-label">
          Enter The Phone Number Where We Can Contact
        </label>
        <br />
        <input
          type="number"
          id="phoneNumber"
          placeholder="Phone Number"
          className="form-input"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <br />
        <button className="form-button" onClick={bloodRequest}>
          Request Blood
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
      
    );
}

export default BloodRequirement;
