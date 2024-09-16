import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const bloodGroups = [
    'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-', 'hh (bombay blood group)', 'inra'
];

// Blood compatibility mapping
const compatibility = {
    'a+': ['a+', 'ab+'],
    'a-': ['a+', 'a-', 'ab+', 'ab-'],
    'b+': ['b+', 'ab+'],
    'b-': ['b+', 'b-', 'ab+', 'ab-'],
    'ab+': ['ab+'],
    'ab-': ['ab+', 'ab-'],
    'o+': ['o+', 'a+', 'b+', 'ab+'],
    'o-': ['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'],
    'hh (bombay blood group)': ['hh (bombay blood group)'],
    'inra': ['inra'] // Add compatibility rules for INRA
};

const DonationDetails = ({ setToken }) => {
    const [donationDetails, setDonationDetails] = useState(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [requiredBlood, setRequiredBlood] = useState('');
    const [filteredBloodGroups, setFilteredBloodGroups] = useState(bloodGroups);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const donationId = queryParams.get('donationId');

    useEffect(() => {
        const getDonationDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:7000/donatersDetail', {
                    headers: { Authorization: token },
                    params: { donaterId: donationId }  // Pass donaterId as a query parameter
                });
                setDonationDetails(response.data);
                console.log(response.data);

                // Set required blood group from response data
                const bloodGroupFromResponse = response.data.bloodGroup.toLowerCase();
                setRequiredBlood(bloodGroupFromResponse);
            } catch (error) {
                console.log(error);
                window.alert('Failed to get donation details');
            }
        };

        if (donationId) {
            getDonationDetails();
        }
    }, [donationId]);

    useEffect(() => {
        if (requiredBlood) {
            setFilteredBloodGroups(bloodGroups.filter(group => compatibility[group]?.includes(requiredBlood)));
        } else {
            setFilteredBloodGroups(bloodGroups);
        }
    }, [requiredBlood]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const data = {
            requestId: donationId,
            phoneNumber,
            bloodGroup
        };

        try {
            const response = await axios.post('http://localhost:7000/addDonorToTheRequest', data, {
                headers: { Authorization: token }
            });

            // Show the message returned from the server
            const message = response.data.message;
            window.alert(message);

            // Clear input fields after successful submission
            setName('');
            setPhoneNumber('');
            setBloodGroup('');
        } catch (error) {
            // Check if there's an error message in the response
            if (error.response && error.response.data && error.response.data.message) {
                window.alert(error.response.data.message);
            } else {
                window.alert('Failed to submit data');
            }
            console.error('Error submitting data:', error);
        }
    };

    if (!donationDetails) {
        return <p>No details available</p>;
    }

    return (
        <div className="donation-details">
            <h1>Donation Details</h1>
            <p><strong>Name:</strong> {donationDetails.name}</p>
            <p><strong>Phone Number:</strong> {donationDetails.phoneNumber}</p>
            <p><strong>Blood Group:</strong> {donationDetails.bloodGroup}</p>
            <p><strong>Date of Query:</strong> {new Date(donationDetails.dateOfQuery).toLocaleString()}</p>
            <p><strong>Expires At:</strong> {new Date(donationDetails.expireAt).toLocaleString()}</p>
            <p><strong>Location:</strong> Latitude: {donationDetails.location.latitude}, Longitude: {donationDetails.location.longitude}</p>
            <button onClick={() => window.open(`https://www.google.com/maps?q=${donationDetails.location.latitude},${donationDetails.location.longitude}`, '_blank')}>
                View Location on Google Maps
            </button>
            <br /><br />
            <p>Fill Out The Form To Donate The Blood.</p>
            <p>Your details will be shared with the Requestor so that he can contact you.</p>

            <div className="modal">
                <h2>Submit Your Details</h2>
                <div className="modal-content" style={{ display: "flex", justifyContent: "center" }}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="bloodGroup">Blood Group:</label>
                        <select
                            id="bloodGroup"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        >
                            <option value="">Select Blood Group</option>
                            {filteredBloodGroups.map((group, index) => (
                                <option key={index} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    </div><br />
                </div>
                <button type="button" onClick={handleSubmit}>Submit</button>
            </div>

        </div>
    );
};

export default DonationDetails;
