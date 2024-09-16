import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './styles/BloodRequirement.css'
import { Link } from 'react-router-dom';

const BloodRequirement = ({ setToken }) => {
    const [requests, setRequests] = useState([]);
    const [bloodGroup, setBloodGroup] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });
    const [successMessage, setSuccessMessage] = useState('');

    const [campName, setCampName] = useState('');
    const [campAddress, setCampAddress] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [campRequests, setCampRequests] = useState([]);
    const [maxEndDate, setMaxEndDate] = useState('');

    // Get today's date in 'YYYY-MM-DD' format
    const currentDate = new Date().toISOString().split('T')[0];

    // Calculate the max end date based on startDate and set it
    useEffect(() => {
        if (startDate) {
            const start = new Date(startDate);
            const maxDate = new Date(start);
            maxDate.setDate(start.getDate() + 10); // Add 10 days
            setMaxEndDate(maxDate.toISOString().split('T')[0]); // Set the max end date in 'YYYY-MM-DD' format
        } else {
            setMaxEndDate(''); // Reset max end date if no start date is selected
        }
    }, [startDate]); // Only recalculate when startDate changes

    const handleSubmit = async () => {
        const formData = {
            location,
            campName,
            campAddress,
            startDate,
            endDate
        };
        const token = localStorage.getItem('token')

        try {
            const response = await axios.post('http://localhost:7000/addCamp', formData, {
                headers: {
                    Authorization: token
                }
            });
            console.log('Camp Data submitted successfully:', response.data);
            getSentCampRequests();
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    useEffect(() => {
        getLocation();
        getSentRequests();
        getSentCampRequests();
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
        } else {
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
            }
        }

        getSentRequests();
    };


    const getSentRequests = async () => {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.get("http://localhost:7000/getUploadedRequest",

                {
                    headers: { Authorization: token }
                });
            setRequests(response.data.requests);
            console.log("response is this for sent requests =>", requests);
        } catch (error) {
            console.error('Request failed:', error);
            setSuccessMessage('Failed to send blood request. Please try again.');
        }
    };

    const getSentCampRequests = async (req, res) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get("http://localhost:7000/getUserCamps", {

                headers: { Authorization: token },
            })
            setCampRequests(response.data.camps);
        } catch (error) {
            console.log(error)
        }
    }

    const deleteCamp = async (campId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete("http://localhost:7000/deleteCamp", {
                params: {
                    campId: campId
                },
                headers: {
                    Authorization: token
                }
            })
            getSentCampRequests();
            console.log(response.data.message)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <h1>Post Camp Details</h1>
                <input
                    type="text"
                    name="campName"
                    id="campName"
                    placeholder='Enter Camp Name'
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    style={{ width: "300px", marginBottom: '10px' }}
                />
                <input
                    type="text"
                    name="campAddress"
                    id="campAddress"
                    placeholder='Enter the address of the camp'
                    value={campAddress}
                    onChange={(e) => setCampAddress(e.target.value)}
                    style={{ width: "300px", marginBottom: '10px' }}
                />
                <label htmlFor="startDate" style={{ marginBottom: '5px' }}>From</label>
            <input
                type="date"
                name="startDate"
                id="startDate"
                value={startDate}
                min={currentDate} // Only allow current and future dates
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: "120px", marginBottom: '10px' }}
            />
            <label htmlFor="endDate" style={{ marginBottom: '5px' }}>To</label>
            <input
                type="date"
                name="endDate"
                id="endDate"
                value={endDate}
                min={startDate || currentDate} // End date cannot be before the start date
                max={maxEndDate} // Set the max date 10 days after the start date
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: "120px", marginBottom: '10px' }}
                disabled={!startDate} // Disable the end date until a start date is selected
            />
                <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</button>
            </div>

            <h2>Posted Camps</h2>
            {campRequests.length > 0 ? (
                campRequests.map((camp) => (
                    <div key={camp._id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                        <h3>{camp.campName}</h3>
                        <p>Address: {camp.campAddress}</p>
                        <p>Start Date: {camp.startDate}</p>
                        <p>End Date: {camp.endDate}</p>
                        <button onClick={() => deleteCamp(camp._id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No camps posted yet.</p>
            )}

            <div className="blood-request-form">
                <label htmlFor="bloodGroup" className="form-label">
                    Enter the Blood Group in small case letters e.g., a+, b+, o-
                </label>
                <br />
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
                <button className="form-button" onClick={bloodRequest}>
                    Request Blood
                </button><br />
                {successMessage && <p className="success-message">{successMessage}</p>}
                <br />
                <button onClick={getSentRequests}>My Requests</button>
            </div>
            <h2>Your Requests</h2>
            <div className='user-Requests'>
                {requests.map((donater, index) => (
                    <div className='requests'>
                        <Link to={`/donorsResponse?requestNumber=${donater._id}`} className='links-decorations'>
                            <div key={donater._id}>
                                <p>Required Blood Group - {donater.bloodGroup}</p>
                                <p>Requestd by - {donater.name}</p>
                                <p>Phone Number - {donater.phoneNumber}</p>
                                <p>Requested at - {new Date(donater.dateOfQuery).toLocaleTimeString()}</p>

                                <p>Donors Responded - {donater.donorsResponse.length}</p>
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
