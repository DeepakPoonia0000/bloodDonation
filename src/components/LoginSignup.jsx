import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import logo from './images/iinsaf.png';
import rightsideloginimg from './images/bloodDonationLogin.jpg';

const LoginSignup = ({ setToken }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:7000/loginUser', { phoneNumber, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      console.log(response);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:7000/addUser', { phoneNumber, password, bloodGroup });
      console.log(response.data.newUser);
    } catch (error) {
      console.error('Signup failed:', error);
    }
    handleLogin();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-50" data-aos="fade-right">
        <img
          src={rightsideloginimg}
          alt="Blood Donation"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white" data-aos="fade-left">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm" data-aos="zoom-in">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login or Sign Up to Your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            {/* Phone Number Input */}
            <div data-aos="fade-up">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  required
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-md border-1  py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Password Input */}
            <div data-aos="fade-up">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-1  py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Blood Group Selection */}
            <div data-aos="fade-up">
              <label htmlFor="bloodGroup" className="block text-sm font-medium leading-6 text-gray-900">
                Blood Group
              </label>
              <div className="mt-2">
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  required
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
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
              </div>
            </div>

            {/* Login Button */}
            <div data-aos="fade-up">
              <button
                onClick={handleLogin}
                className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>

            {/* Signup Button */}
            <div>
              <button
                onClick={handleSignup}
                className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
