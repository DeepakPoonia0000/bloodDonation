import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import userlogo from './images/User.png'
const bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'HH (Bombay Blood Group)', 'INRA'
];

const DonationDetails = ({ setToken }) => {
    const [donationDetails, setDonationDetails] = useState(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const donationId = queryParams.get('donationId');

    useEffect(() => {
        const getDonationDetails = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get('http://localhost:7000/donatersDetail', {
                    params: { donaterId: donationId },
                    headers: { Authorization: token }
                });
                setDonationDetails(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error);
                window.alert('Failed to get donation details');
            }
        };

        if (donationId) {
            getDonationDetails();
        }
    }, [donationId]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token')
        const data = {
            requestId: donationId,
            phoneNumber,
            bloodGroup
        };

        try {
            const response = await axios.post('http://localhost:7000/addDonorToTheRequest', data, {
                headers: { Authorization: token }
            });
            console.log(response);
            window.alert('Data submitted successfully');
            setName('');
            setPhoneNumber('');
            setBloodGroup('');
        } catch (error) {
            console.log(error);
            window.alert('Failed to submit data');
        }
    };

    if (!donationDetails) {
        return <p>No details available</p>;
    }

    return (
        <div className="donation-details border ml-5 mt-5 p-4 mr-5 justify-center flex flex-col items-center  mb-10">
            <div className='flex flex-wrap  md:border-4 md:px-60 p-20 bg-gray-300 font-montserrat'>
                <div className='mt-32 flex items-center justify-center w-full  md:hidden  sm:hidden lg:hidden xl:hidden'>
                    <img className='h-40' src={userlogo} />
                </div>
                <div className='flex flex-col items-start h-full'>
                    <h1>Donation Details</h1>

                    <div className='flex flex-wrap justify-between w-full'>
                        <p><strong>Name:</strong></p>
                        <p>{donationDetails.name}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <p><strong>Phone Number:</strong></p>
                        <p>{donationDetails.phoneNumber}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <p><strong>Blood Group:</strong></p>
                        <p>{donationDetails.bloodGroup}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <strong>Date of Query:</strong>
                        <p>{new Date(donationDetails.dateOfQuery).toLocaleString()}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <strong>Expires At:</strong>
                        <p>{new Date(donationDetails.expireAt).toLocaleString()}</p>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <strong>Location:</strong>
                        <p>Latitude: {donationDetails.location.latitude}, Longitude: {donationDetails.location.longitude}</p>
                    </div>

                    {/* Button stays at the bottom with mt-auto */}
                    <button
                        className='h-30 mt-auto text-red-500'
                        onClick={() => window.open(`https://www.google.com/maps?q=${donationDetails.location.latitude},${donationDetails.location.longitude}`, '_blank')}
                    >
                        View Location on Google Maps
                    </button>
                </div>

                <div className='mt-[35px] ml-20 md:hidden hidden sm:hidden lg:block xl:block'>
                    <img className='h-40' src={userlogo} />
                </div>
            </div>
            
            <br /><br />
            <div className='text-xl' >
            <p>Fill Out The Form To Donate The Blood.</p>
            <p>Your details will be shared with the Requestor so that he can contact you.</p>
            </div>
            <div className="flex flex-col items-center justify-center text-red-500 p-4 bg-gray-300">
                <h2 className="text-xl font-bold mb-4">Submit Your Details</h2>

                <div className="w-full max-w-md grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-2 font-semibold">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="phoneNumber" className="mb-2 font-semibold">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="border-2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="bloodGroup" className="mb-2 font-semibold">Blood Group:</label>
                        <select
                            id="bloodGroup"
                            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map((group, index) => (
                                <option key={index} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-6 bg-indigo-600 font-montserrat font-light  text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 rounded-2xl text-xl transition"
                >
                    Submit
                </button>
            </div>


        </div>
    );
};

export default DonationDetails;
