import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserDetails = () => {
    const [requestId, setRequestId] = useState('');
    const [user, setUser] = useState({});
    const [donationRequests, setDonationRequests] = useState([]);
    const [previousDonationRequests, setPreviousDonationRequests] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(location.search);
            const requestId = queryParams.get('userId');
            setRequestId(requestId);

            if (requestId) {
                const token = localStorage.getItem('adminToken');
                try {
                    const response = await axios.get('http://localhost:7000/userDetails', {
                        headers: { Authorization: token },
                        params: { requestId: requestId }
                    });
                    console.log("this is the response from the server for fetchData =>", response.data);
                    setUser(response.data.userDetails || {});
                    setDonationRequests(response.data.donationRequests || []);
                    setPreviousDonationRequests(response.data.previousDonationRequests || []);
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [location.search]);

    return (
        <>
            <div>
                <h2>User Details {requestId}</h2>
                <p>Blood Group - {user.bloodGroup}</p>
                <p>Joined On - {user.joinedOn ? new Date(user.joinedOn).toLocaleDateString() : 'N/A'}</p>
                <p>Phone Number - {user.phoneNumber}</p>
            </div>
            <div>
                <h2>Active Donation Requests</h2>
                {donationRequests.length > 0 ? (
                    donationRequests.map((donation, index) => (
                        <div key={donation._id} className="donation-request">
                            <h3>Request #{index + 1} - {donation._id}</h3>
                            <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
                            <p><strong>Date of Query:</strong> {new Date(donation.dateOfQuery).toLocaleString()}</p>
                            <Link to={`/donorsResponseAdmin?requestId=${donation._id}`}><p><strong>Donors Response:</strong> {donation.donorsResponse.length > 0 ? donation.donorsResponse.join(', ') : 'No responses yet'}</p></Link>
                            <p><strong>Expire At:</strong> {new Date(donation.expireAt).toLocaleString()}</p>
                            <p><strong>Location:</strong> Longitude: {donation.location.longitude}, Latitude: {donation.location.latitude}</p>
                            <p><strong>Name:</strong> {donation.name}</p>
                            <p><strong>Phone Number:</strong> {donation.phoneNumber}</p>
                            <br /><br /><br />
                        </div>
                    ))
                ) : (
                    <p>No donation requests available.</p>
                )}
            </div>
            <div>
                <h2>Previous Donation Requests</h2>
                {previousDonationRequests.length > 0 ? (
                    previousDonationRequests.map((donation, index) => (
                        <div key={donation._id} className="donation-request">
                            <h3>Request #{index + 1} - {donation._id}</h3>
                            <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
                            <p><strong>Date of Query:</strong> {new Date(donation.dateOfQuery).toLocaleString()}</p>
                            <p><strong>Location:</strong> Longitude: {donation.location.longitude}, Latitude: {donation.location.latitude}</p>
                            <p><strong>Name:</strong> {donation.name}</p>
                            <p><strong>Phone Number:</strong> {donation.phoneNumber}</p>
                            <br /><br /><br />
                        </div>
                    ))
                ) : (
                    <p>No previous donation requests available.</p>
                )}
            </div>
        </>
    );
};

export default UserDetails;
