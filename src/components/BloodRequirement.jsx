import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './styles/BloodRequirement.css'
import { Link } from 'react-router-dom';

const BloodRequirement = ({setToken}) => {
    const [requests, setRequests] = useState([]);
    const [bloodGroup, setBloodGroup] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        getLocation();
        getSentRequests();
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
                            console.log("There is no error is fetching location");
                    }
                }
            );
        } else {
            alert('Geolocation is not supported by this browser');
        }
    };

    const bloodRequest = async () => {
        if (!bloodGroup || !location) {
            window.alert("Blood Group and location is required for sending request");
        }else{
        const userData = { bloodGroup, location, name };
        const token = localStorage.getItem("token")
        try {
            const response = await axios.post("http://localhost:7000/sendBloodRequest", userData, {
                headers: { Authorization: token }
            });
            setSuccessMessage('Blood request sent successfully!');
            console.log("response is this from =>", response.data);
        } catch (error) {
            console.error('Request failed:', error);
            setSuccessMessage('Failed to send blood request. Please try again.');
        }}

        getSentRequests();
    };


    const getSentRequests = async () => {
        const userData = { bloodGroup, location, name };
        const token = localStorage.getItem("token")
        try {
            const response = await axios.post("http://localhost:7000/getUploadedRequest", userData, {
                headers: { Authorization: token }
            });
            setRequests(response.data.requests);
            console.log("response is this for sent requests =>", requests);
        } catch (error) {
            console.error('Request failed:', error);
            setSuccessMessage('Failed to send blood request. Please try again.');
        }
    };

    return (
        <>
            <div className="blood-request-form ">
                <label htmlFor="bloodGroup" className="form-label">
                    Enter the Blood Group in small case letters e.g., a+, b+, o-
                </label>
                <br />
                <select className='h-10 border-2 border-black' value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
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
                <br />
                <label htmlFor="Name" className="form-label">
                    Enter The Name
                </label>
                <br />
                <input
                    type="text"
                    id="name"
                    placeholder="Name Of Requestor"
                    className="form-input"
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <button className="form-button !bg-red-400 hover:!bg-red-500" onClick={bloodRequest}>
                    Request Blood
                </button><br />
                {successMessage && <p className="success-message">{successMessage}</p>}
                <br />
                <button onClick={getSentRequests}>My Requests</button>
            </div>
            <h2>Your Requests</h2>
            <div className='user-Requests lg:text-2xl sm:text-2xl xl:text-2xl md:text-xl  text-xl ml-2 mr-2 mb-10 flex items-center justify-evenly'>
                {requests.map((donater, index) => (
                    <div className='request border-4 bg-body-tertiary  py-2  px-3  rounded-xl hover:shadow-2xl'>
                    <Link to={`/donorsResponse?requestNumber=${donater._id}`} className='links-decorations'>
                    <div key={donater._id}>
                        <div className='flex ml-2 justify-between mr-4  '>
                        <p>Required Blood Group :</p> <p className='bg-red-500 px-4 py-1 flex items-center justify-center rounded-2xl text-white'> {donater.bloodGroup.toUpperCase()}</p>
                        </div>
                        <div className='flex ml-2 justify-between mr-2 items-start'>
                        <p>Requestd by : </p> <p> {donater.name}</p>
                        </div>
                        <div className='flex ml-2 justify-between mr-2 items-start'>
                        
                        <p>Phone Number :</p> <p> {donater.phoneNumber}</p>
                        </div>
                        <div className='flex ml-2 justify-between mr-2 items-start'>

                        <p>Requested at : </p><p> {new Date(donater.dateOfQuery).toLocaleTimeString()}</p>
                        </div>                  
                        <div className='flex ml-2 justify-between mr-2 items-start'>
      
                        <p>Donors Responded : </p><p> {donater.donorsResponse.length}</p>
                        </div>                        
                        <br /><br />
                    </div>
                    </Link>
                    <p>
                            <a
                                href={`https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Request Location on Google Maps
                            </a>
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default BloodRequirement;
