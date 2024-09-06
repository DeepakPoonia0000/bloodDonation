import React, { useEffect, useState } from 'react';
import '../Styles/LoginSignup.css'
import axios from 'axios';
import backgif from '../Assets/MPE.gif'
import backgif2 from '../Assets/loginone.gif'

const LoginSignup = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({
    longitude: "shop's",
    latitude: "location"
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }
    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }
    try {
      const response = await axios.post('http://localhost:7000/loginUser', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      localStorage.setItem('role', response.data.role);
      console.log(response);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }
    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }
    if (role === 'shop' && pincode.length < 6) {
      alert('Pincode should be at least 6 digits long');
      return;
    }

    const userData = { email, password, role };
    if (role === 'shop') {
      console.log("location =>", location)
      userData.role = 'R@7yU5vK*9#L^eP&1!sF8$2B0oQmWzD4xJ%pC3gN#6T$Y';
      Object.assign(userData, { name, shopName, pincode, address, location });
    } else {
      userData.role = 'jI$3Mv@8kP&lD6G#9oK!uS^zW0YdR*L1fT7W#bNp8qXvE$2';
    }
    try {
      console.log(userData)
      const response = await axios.post('http://localhost:7000/addUser', userData);
      localStorage.setItem('role', response.data.newUser.role);
      console.log(response.data.newUser);

    } catch (error) {
      console.error('Signup failed:', error);

    }
    handleLogin();
  };


  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          setLocation({
            longitude: `${longitude}`,
            latitude: `${latitude}`
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              alert("Please enable location permissions for this app.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              alert("Location information is unavailable. Please try again later.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              alert("The request to get your location timed out. Please try again.");
              break;
            case error.UNKNOWN_ERROR:
              console.error("An unknown error occurred.");
              alert("An unknown error occurred. Please try again.");
              break;
          }
        }
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  };

  return (
    <>
      <div className='back-container'>
        <img src={backgif} alt="error" className='wide' />
        <img src={backgif2} alt="error" className='slim' />
      </div>
      <div className="auth-container">
        <h1>Login/Signup</h1>
        <div className="form-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="shop">Shop</option>
          </select>
          {role === 'shop' && (
            <>
              <input
                type="text"
                placeholder="Owner's Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="location-container">
                <input
                  type="text"
                  placeholder="Location"
                  value={`${location.longitude} -  ${location.latitude}`}
                  readOnly
                // style={{ width: '270px' }}
                />
                <button onClick={getLocation}>Get Location</button>
              </div>
            </>
          )}
          <div className="button-container">
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignup}>Signup</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
