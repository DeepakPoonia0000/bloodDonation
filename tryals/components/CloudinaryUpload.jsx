import React, { useState } from 'react';
import axios from 'axios';

const CloudinaryUpload = () => {
  const [productImage, setProductImage] = useState([]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'localShop'); 
        formData.append('cloud_name', 'dhdk9yop5');

        const response = await axios.post('https://api.cloudinary.com/v1_1/dhdk9yop5/image/upload', formData);
        return response.data.secure_url;
      })
    );

    setProductImage([...productImage, ...uploadedImages]);
  };

  const addProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:7000/addProduct',
        {
          productImage,
          // Other product details can be added here
        },
        {
          headers: { Authorization: token }
        }
      );
      console.log('Product added successfully', response.data);
    } catch (error) {
      console.log("error number one =>", error.response?.data?.error || 'Failed to add product');
      window.alert(error.response?.data?.error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageUpload} />
      <button onClick={addProduct}>Submit</button>
    </div>
  );
};

export default CloudinaryUpload;
