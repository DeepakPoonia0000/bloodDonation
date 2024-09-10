import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Hero.css';
import { Link, useNavigate } from 'react-router-dom';

const DropdownCard = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-card">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {isOpen ? `Hide ${title}` : `Show ${title}`}
      </button>
      {isOpen && <div className="dropdown-content">{content}</div>}
    </div>
  );
};

const Hero = ({setToken}) => {
  const [donaters, setDonaters] = useState([]);
  const [location, setLocation] = useState({
    longitude: null,
    latitude: null
  });

  const navigate = useNavigate();

  const sendLocation = async () => {
    const token = localStorage.getItem('token');

    if (location.latitude && location.longitude) {
      try {
        // const response = await axios.post(
        //   "http://localhost:7000/getLocation",
        //   { location },
        //   {
        //     headers: { Authorization: token }
        //   }

          const response = await axios.get(
            "http://localhost:7000/getLocation",
            
            {
              params:{ location },
              headers: { Authorization: token }
            }
        );

        console.log(response);
        // window.alert("Requests Fetched Successfully");
        setDonaters(response.data);
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

  return (
    <div className="hero-container">
      <button onClick={() => navigate("/bloodRequirement")}>
        Post Blood Requirement REQUEST
      </button>
      <br /><br />
      {/* <Link to='/bloodRequirement'>Post Blood Requirement REQUEST</Link> */}

      <button onClick={sendLocation}>Get Requests</button>
      <div>
        <ul className="donater-grid">
          {donaters.map((donater, index) => (
            <Link to={`/donationDetails?donationId=${donater._id}`} key={index}>
            <li >
              <div>
                <p>Required Blood Group - {donater.bloodGroup}</p>
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
                <p>Requested at - {new Date(donater.dateOfQuery).toLocaleTimeString()}</p>
                <p>
                  <a
                    href={`https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Location on Google Maps
                  </a>
                </p>
              </div>
              <p>Donors Responded - {donater.donorsResponse.length}</p>
            </li>
            </Link>
          ))}
        </ul>
      </div>

      <div className="motivational-wrapper">
        <DropdownCard
          title="Why Donate Blood?"
          content={
            <>
              <h3>Why Donate Blood?</h3>
              <p>Every drop counts. Your blood donation can save up to three lives! It’s a simple, yet powerful way to give back and help those in need.</p>
            </>
          }
        />

        <DropdownCard
          title="Information You Should Know"
          content={
            <>
              <h3>Donate blood, save a life.</h3>
              <ul>
                <li>Donation frequency: Every 56 days, up to 6 times a year*</li>
                <li>You must be in good health and feeling well**</li>
                <li>You must be at least 16 years old in most states</li>
                <li>You must weigh at least 110 lbs</li>
                <li>See additional requirements for students</li>
              </ul>
            </>
          }
        />

        <DropdownCard
          title="Facts About Blood Donation"
          content={
            <>
              <h3>Facts About Blood Donation</h3>
              <ul>
                <li>Blood donation takes just 10-15 minutes, but it can give someone a lifetime.</li>
                <li>Every two seconds, someone in the world needs blood.</li>
                <li>There is no substitute for human blood—donating is the only way to help.</li>
                <li>Regular donors are key to ensuring blood is always available.</li>
              </ul>
            </>
          }
        />

        {/* <DropdownCard
        title="How You Can Help"
        content={
          <>
            <h3>How You Can Help</h3>
            <p>Ready to make a difference? Become a regular blood donor today. Share your blood group and location to help us reach you whenever there’s a need.</p>
            <button onClick={() => navigate("/donateBlood")}>Donate Blood</button>
          </>
        }
      /> */}
      </div>
      <button onClick={()=> {localStorage.clear(); setToken("")}}>Log Out</button>
    </div>
  );
};

export default Hero;






// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './styles/Hero.css';
// import { useNavigate } from 'react-router-dom';

// const DropdownCard = ({ title, content }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="dropdown-card">
//       <button className="dropdown-toggle" onClick={toggleDropdown}>
//         {isOpen ? `Hide ${title}` : `Show ${title}`}
//       </button>
//       {isOpen && <div className="dropdown-content">{content}</div>}
//     </div>
//   );
// };

// const Hero = ({ setToken }) => {
//   const [donaters, setDonaters] = useState([]);
//   const [location, setLocation] = useState({
//     longitude: null,
//     latitude: null,
//   });
//   const [selectedDonater, setSelectedDonater] = useState(null); // State to track selected donater
//   const navigate = useNavigate();

//   const sendLocation = async () => {
//     const token = localStorage.getItem('token');

//     if (location.latitude && location.longitude) {
//       try {
//         const response = await axios.post(
//           'http://localhost:7000/getLocation',
//           { location },
//           {
//             headers: { Authorization: token },
//           }
//         );

//         console.log(response);
//         window.alert('Requests Fetched Successfully');
//         setDonaters(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const getLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };

//   useEffect(() => {
//     getLocation();
//   }, []);

//   // Run sendLocation once location is updated
//   useEffect(() => {
//     if (location.latitude && location.longitude) {
//       sendLocation();
//     }
//   }, [location]);

//   // Modal open handler
//   const openModal = (donater) => {
//     setSelectedDonater(donater);
//   };

//   // Modal close handler
//   const closeModal = () => {
//     setSelectedDonater(null);
//   };

//   return (
//     <div className="hero-container">
//       <button onClick={() => navigate('/bloodRequirement')}>Post Blood Requirement REQUEST</button>
//       <br />
//       <br />

//       <button onClick={sendLocation}>Get Requests</button>
//       <div>
//         <ul className="donater-grid">
//           {donaters.map((donater, index) => (
//             <li key={index} onClick={() => openModal(donater)}> {/* Open modal on list item click */}
//               <div>
//                 <p>Required Blood Group - {donater.bloodGroup}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Modal */}
//       {selectedDonater && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={closeModal}>&times;</span>
//             <p>Required Blood Group - {selectedDonater.bloodGroup}</p>
//             <p>
//               <a
//                 href={`https://wa.me/${selectedDonater.phoneNumber}?text=${encodeURIComponent(
//                   `Blood request for group ${selectedDonater.bloodGroup}. Location: https://www.google.com/maps?q=${selectedDonater.location.latitude},${selectedDonater.location.longitude}`
//                 )}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Send WhatsApp Message
//               </a>
//             </p>
//             <p>Requested at - {new Date(selectedDonater.dateOfQuery).toLocaleTimeString()}</p>
//             <p>
//               <a
//                 href={`https://www.google.com/maps?q=${selectedDonater.location.latitude},${selectedDonater.location.longitude}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 View Location on Google Maps
//               </a>
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="motivational-wrapper">
//         <DropdownCard
//           title="Why Donate Blood?"
//           content={
//             <>
//               <h3>Why Donate Blood?</h3>
//               <p>Every drop counts. Your blood donation can save up to three lives! It’s a simple, yet powerful way to give back and help those in need.</p>
//             </>
//           }
//         />

//         <DropdownCard
//           title="Information You Should Know"
//           content={
//             <>
//               <h3>Donate blood, save a life.</h3>
//               <ul>
//                 <li>Donation frequency: Every 56 days, up to 6 times a year*</li>
//                 <li>You must be in good health and feeling well**</li>
//                 <li>You must be at least 16 years old in most states</li>
//                 <li>You must weigh at least 110 lbs</li>
//                 <li>See additional requirements for students</li>
//               </ul>
//             </>
//           }
//         />

//         <DropdownCard
//           title="Facts About Blood Donation"
//           content={
//             <>
//               <h3>Facts About Blood Donation</h3>
//               <ul>
//                 <li>Blood donation takes just 10-15 minutes, but it can give someone a lifetime.</li>
//                 <li>Every two seconds, someone in the world needs blood.</li>
//                 <li>There is no substitute for human blood—donating is the only way to help.</li>
//                 <li>Regular donors are key to ensuring blood is always available.</li>
//               </ul>
//             </>
//           }
//         />
//       </div>
//       <button onClick={() => { localStorage.clear(); setToken(''); }}>Log Out</button>

//       {/* Modal styles */}
//       <style jsx>{`
//         .modal {
//           display: block;
//           position: fixed;
//           z-index: 1;
//           left: 0;
//           top: 0;
//           width: 100%;
//           height: 100%;
//           background-color: rgba(0, 0, 0, 0.5);
//         }
//         .modal-content {
//           background-color: #fff;
//           margin: 15% auto;
//           padding: 20px;
//           border: 1px solid #888;
//           width: 80%;
//         }
//         .close {
//           color: #aaa;
//           float: right;
//           font-size: 28px;
//           font-weight: bold;
//         }
//         .close:hover,
//         .close:focus {
//           color: black;
//           text-decoration: none;
//           cursor: pointer;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Hero;
