// app.js

import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Hero from './components/Hero';
import LoginSignup from './components/LoginSignup';
import { useState, useEffect } from 'react';
import BloodRequirement from './components/BloodRequirement';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken || '');
    };

    checkAuth();
  }, []);


  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/home" /> : <LoginSignup setToken={setToken} />} />

          <Route path="/home" element={token ? <Hero setToken = {setToken}/> : <Navigate to="/" />} />
          <Route path="/bloodRequirement" element={<BloodRequirement />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
