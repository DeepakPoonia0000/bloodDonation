// app.js

import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Hero from './components/Hero';
import LoginSignup from './components/LoginSignup';
import { useState, useEffect } from 'react';
import BloodRequirement from './components/BloodRequirement';
import DonationDetails from './components/DonationDetails';
import DonorResponse from './components/DonorResponse';

function App() {

  const [token, setToken] = useState('');

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || '');
  };

  useEffect(() => {
    checkAuth();
  }, []);



  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/home" /> : <LoginSignup setToken={setToken} />} />

          <Route path="/home" element={token ? <Hero setToken = {setToken}/> : <Navigate to="/" />} />
          <Route path="/bloodRequirement" element={token ? <BloodRequirement setToken = {setToken}/> : <Navigate to="/" />} />
          <Route path="/donationDetails" element={token ? <DonationDetails setToken = {setToken}/> : <Navigate to="/" />} />
          <Route path="/donorsResponse" element={token ? <DonorResponse setToken = {setToken} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
