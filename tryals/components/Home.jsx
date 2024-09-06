import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import '../Styles/Home.css';
import { Link, useNavigate } from 'react-router-dom';

const Home = ({setToken , setRole}) => {
  const [shops, setShops] = useState([]);
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observer = useRef();

  const getShops = async (pincode = '', page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:7000/shops', {
        headers: { Authorization: token },
        params: { pincode, page, limit: 10 },
      });

      const { shops: newShops, role, total } = response.data;

      setShops((prevShops) => [...prevShops, ...newShops]);
      setIsShopOwner(role === 'R@7yU5vK*9#L^eP&1!sF8$2B0oQmWzD4xJ%pC3gN#6T$Y');
      setHasMore(newShops.length > 0 && shops.length + newShops.length < total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || 'Failed to fetch shops');
    }
  };

  useEffect(() => {
    getShops(pincode, page);
  }, [page]);

  const handleYourProductsClick = () => {
    navigate('/yourProducts');
  };

  const handlePincodeSearch = () => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setShops([]);
      setPage(1);
      setHasMore(true);
      getShops(pincode, 1);
    } else {
      alert('Please enter a valid 6-digit pincode');
    }
  };

  const lastShopElementRef = useCallback((node) => {
    // console.log("node is this =>", node)
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      // console.log("enteries is this =>", entries);
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
        // console.log("page is this =>", page) the page value increases by 1 whenever we reach the element at the end and next elements are loaded
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);


  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setRole('');
  };

  return (
    <div className='home-container'>
      <h1 className='headd'>Shops</h1>
      <input
        type="text"
        placeholder="Enter Your Pincode For Nearby Shops (within a radius of 30Km)."
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />
      <button onClick={handlePincodeSearch}>Search by Pincode</button>
      {error && <p>{error}</p>}
      <ul className='shops-list'>
        {shops.map((shop, index) => (
          <>
            <li ref={index === shops.length - 1 ? lastShopElementRef : null}>
          <Link to={`/showProducts?shopName=${shop.shopName}`} key={index} style={{ width: "300px" }}>
              <h2>{shop.shopName}</h2>
              <p>Address: {shop.address}</p>
              <p>Pincode: {shop.pincode}</p>
              
          </Link>
          <a
          href={`https://www.google.com/maps?q=${shop.location.latitude},${shop.location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className='shop-location'
        >
          View on Google Maps
        </a>
            </li>
          
        </>
        ))}
      </ul>
      {loading && <p>Loading more shops...</p>}
      {isShopOwner && (
        <button onClick={handleYourProductsClick}>Your Products</button>
      )}
       <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Home;
