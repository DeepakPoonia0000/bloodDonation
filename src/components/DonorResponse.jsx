import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation for query params

const DonorResponse = ({ setToken }) => {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');

  const location = useLocation(); // Get the location object from react-router-dom


    // for go to the top on reload the page
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    // Extract requestNumber from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const requestNumber = queryParams.get('requestNumber');

    if (requestNumber) {
      getSentRequests(requestNumber);
    } else {
      setError('No request number found in the URL.');
    }
  }, [location.search]); // Dependency array to re-run if URL changes

  const getSentRequests = async (requestNumber) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:7000/getDonorsResponses",

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
    <div className="min-h-screen">
      <h2>Donor Responses</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responses.length > 0 ? (
        <ul>
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

export default DonorResponse;
