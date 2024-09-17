import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Hero.css';
import { Link, useNavigate } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Accordion from 'react-bootstrap/Accordion';
import { FaHeartbeat, FaHandHoldingHeart, FaTint } from 'react-icons/fa';

// const DropdownCard = ({ title, content }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="dropdown-card">
//       <button className="dropdown-toggle text-wrap" onClick={toggleDropdown}>
//         {isOpen ? `Hide ${title}` : `Show ${title}`}
//       </button>
//       {isOpen && <div className="dropdown-content bg-white text-red-500">{content}</div>}
//     </div>
//   );
// };





const Hero = ({ setToken }) => {
  const [donaters, setDonaters] = useState([]);
  const [location, setLocation] = useState({
    longitude: null,
    latitude: null
  });
  const [campRequests, setCampRequests] = useState([]);
  const navigate = useNavigate();

  const sendLocation = async () => {
    const token = localStorage.getItem('token');


    if (location.latitude && location.longitude) {
      try {
        const response = await axios.get('http://localhost:7000/getLocation', {
          params: { location },
          headers: { Authorization: token },
        });

        console.log(response);
        setDonaters(response.data.donaters || []);  // Handle potential undefined
        setCampRequests(response.data.camps || []);  // Handle potential undefined
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);
  // 192.168.1.11:3000
  // Run sendLocation once location is updated
  useEffect(() => {
    if (location.latitude && location.longitude) {
      sendLocation();
    }
  }, [location]);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);


  const [showCamps, setShowCamps] = useState(false);


  return (
    <div className="hero-container" data-aos='fade-left'>

      <div className="max-w-4xl mx-auto p-4">


        {/* Accordion for Info Sections */}
        <Accordion defaultActiveKey="0">
          {/* Section 1: Eligibility */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <FaTint className="mr-2 text-red-600" /> Eligibility to Donate Blood
            </Accordion.Header>
            <Accordion.Body>
              <ul className="list-disc pl-6">
                <li>Minimum age to donate blood: 18 years</li>
                <li>Minimum weight: 50 kg (110 lbs)</li>
                <li>Donation frequency: Every 56 days for whole blood</li>
                <li>Healthy with no major medical conditions</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Section 2: Blood Group Compatibility */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <FaHeartbeat className="mr-2 text-red-600" /> Blood Group Compatibility
            </Accordion.Header>
            <Accordion.Body>
              <h4 className="text-lg font-semibold mb-2">Who can donate to whom?</h4>
              <div className="overflow-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-red-200">
                      <th className="border p-2 text-red-800">Blood Type</th>
                      <th className="border p-2 text-red-800">Can Donate To</th>
                      <th className="border p-2 text-red-800">Can Receive From</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">O-</td>
                      <td className="border p-2">All blood types (Universal Donor)</td>
                      <td className="border p-2">O-</td>
                    </tr>
                    <tr>
                      <td className="border p-2">O+</td>
                      <td className="border p-2">O+, A+, B+, AB+</td>
                      <td className="border p-2">O+, O-</td>
                    </tr>
                    <tr>
                      <td className="border p-2">A-</td>
                      <td className="border p-2">A-, A+, AB-, AB+</td>
                      <td className="border p-2">A-, O-</td>
                    </tr>
                    <tr>
                      <td className="border p-2">A+</td>
                      <td className="border p-2">A+, AB+</td>
                      <td className="border p-2">A+, A-, O+, O-</td>
                    </tr>
                    <tr>
                      <td className="border p-2">B-</td>
                      <td className="border p-2">B-, B+, AB-, AB+</td>
                      <td className="border p-2">B-, O-</td>
                    </tr>
                    <tr>
                      <td className="border p-2">B+</td>
                      <td className="border p-2">B+, AB+</td>
                      <td className="border p-2">B+, B-, O+, O-</td>
                    </tr>
                    <tr>
                      <td className="border p-2">AB-</td>
                      <td className="border p-2">AB-, AB+</td>
                      <td className="border p-2">AB-, A-, B-, O-</td>
                    </tr>
                    <tr>
                      <td className="border p-2">AB+</td>
                      <td className="border p-2">AB+ (Universal Receiver)</td>
                      <td className="border p-2">All blood types</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Section 3: Benefits of Blood Donation */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <FaHandHoldingHeart className="mr-2 text-red-600" /> Benefits of Donating Blood
            </Accordion.Header>
            <Accordion.Body>
              <ul className="list-disc pl-6">
                <li>Helps save lives by providing essential blood to those in need</li>
                <li>Reduces the risk of heart disease by improving blood flow</li>
                <li>Promotes healthy cell regeneration and improves cardiovascular health</li>
                <li>Burns calories and can help with weight maintenance</li>
                <li>Psychological benefits, including the feeling of helping others</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      {/* <button onClick={() => navigate("/bloodRequirement")}>
        Post Blood Requirement REQUEST
      </button> */}
      <br /><br />
      {/* <Link to='/bloodRequirement'>Post Blood Requirement REQUEST</Link> */}

      {/* <button onClick={sendLocation}>Get Requests</button> */}

      <button
        onClick={() => setShowCamps(!showCamps)}
        className="mb-4 bg-blue-500  text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showCamps ? 'Hide Camps' : 'Show Camps'}
      </button>

      {showCamps ? (
        campRequests.length > 0 ? (
          <div className="flex flex-col p-4 md:p-6 lg:p-8">
            <h2>Camps</h2>
            <div className="grid gap-4 justify-center items-center md:grid-cols-2 lg:grid-cols-3">
              {campRequests.map((camp, index) => (
                <div
                  key={index}
                  className={`bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8 flex flex-col ${camp.value === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                    }`}
                  style={camp.value === 2 ? { gridColumn: '2 / 3', gridRow: '1 / 2' } : {}}
                >
                  <h1 className="text-xl font-semibold text-gray-800">{camp.campName}</h1>
                  <h2 className="text-lg text-gray-600">{camp.campAddress}</h2>
                  <h3 className="text-sm text-gray-500 mb-4">
                    from - {new Date(camp.startDate).toLocaleDateString('en-IN')} - to -{' '}
                    {new Date(camp.endDate).toLocaleDateString('en-GB')}
                  </h3>

                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${camp.location?.latitude},${camp.location?.longitude}`,
                        '_blank'
                      )
                    }
                    className="mt-auto !bg-red-400 text-white px-4 py-2 rounded !hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Location
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 p-4">No camp requests available.</p>
        )
      ) : null}


      <div data-aos='fade-zoom'>
        <h2>Blood Request</h2>
        <ul className="donater-grid ml-2 mr-2 flex items-center lg:text-2xl justify-evenly">
          {donaters.map((donater, index) => (
            <Link to={`/donationDetails?donationId=${donater._id}`} key={index}>
              <li className='border-4' >
                <div>
                  <div className='flex flex-wrap justify-between w-full'>
                    <p>Required Blood Group</p>
                    <p className='text-white flex  justify-center items-center rounded-2xl px-4 py-1 bg-red-500'> {donater.bloodGroup.toUpperCase()}</p>
                  </div>
                  <div className='flex flex-wrap justify-between w-full'>
                    <p>
                      <a
                        href={`https://wa.me/${donater.phoneNumber}?text=${encodeURIComponent(
                          `Blood request for group ${donater.bloodGroup}. Location: https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Send WhatsApp Message
                      </a>
                    </p>
                  </div>
                  <div className='flex felx-wrap justify-between w-full'>
                    <p>Requested at - {new Date(donater.dateOfQuery).toLocaleTimeString()}</p>
                  </div>
                  <p className='flex'>
                    <a
                      href={`https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Location on Google Maps
                    </a>
                  </p>
                </div>
                <p className='flex'>Donors Responded - {donater.donorsResponse.length}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Hero;