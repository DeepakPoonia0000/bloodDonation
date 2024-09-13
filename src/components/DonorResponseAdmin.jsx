import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const DonorResponseAdmin = () => {
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState('');

    const location = useLocation(); // Get the location object from react-router-dom

    useEffect(() => {
        // Extract requestNumber from the URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const requestNumber = queryParams.get('requestId');
        console.log(requestNumber)

        if (requestNumber) {
            getSentRequests(requestNumber);
        } else {
            setError('No request number found in the URL.');
        }
    }, [location.search]); // Dependency array to re-run if URL changes

    const getSentRequests = async (requestNumber) => {
        const token = localStorage.getItem("adminToken");
        try {
            const response = await axios.get(
                "http://localhost:7000/getDonorsResponsesAdmin",
                {
                    params: { requestId: requestNumber },
                    headers: { Authorization: token }
                }
            );
            setResponses(response.data.donorsResponse);
            console.log("response is this for sent requests =>", response.data.donorsResponse);
        } catch (error) {
            console.error('Request failed:', error);
            setError('Failed to fetch donor responses. Please try again.');
        }
    };

    return (
        <div>
            <div className='flex mt-7 items-center justify-center'>
                <Link to='/admin' className="text-lg block mb-4 px-3 py-1 rounded-2xl no-underline hover:underline hover:bg-green-700 bg-green-500 text-white"> Admin Home</Link>
            </div>
            <hr className='mt-10'/>
            <h2>Donor Responses Admin</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {responses.length > 0 ? (
                <ul className='donor-responses'>
                    {responses.map((response, index) => (
                        <li key={index}>
                            <p>Donor ID: {response.donorId}</p>
                            <p>Phone Number: {response.phoneNumber}</p>
                            <p>Blood Group: {response.bloodGroup}</p>
                            <br /><br /><br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No responses available</p>
            )}
        </div>
    );
};

export default DonorResponseAdmin