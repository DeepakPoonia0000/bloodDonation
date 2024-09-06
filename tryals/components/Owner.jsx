import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../Styles/Owner.css'

const Owner = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('')
  const [sizeInput, setSizeInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [form, setForm] = useState({
    objectId: '',
    productImage: [],
    productName: '',
    description: '',
    colors: [],
    size: [],
    price: ''
  });

  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:7000/products', {
        headers: { Authorization: token }
      });
      console.log(response);
      setProducts(response.data);
    } catch (error) {
      console.log(error.response?.data?.error || 'Product Fetching Failed');
    }
  };

  const deleteProduct = async (objectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:7000/delete', {
        headers: { Authorization: token },
        data: { productId: objectId }
      });
      console.log(response.data.message);
      getProducts();
    } catch (error) {
      console.log(error.response?.data?.error || 'Failed to delete product');
    }
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:7000/update', {
        productId: form.objectId,
        productImage: form.productImage,
        productName: form.productName,
        description: form.description,
        colors: form.colors,
        size: form.size,
        price: form.price
      }, {
        headers: { Authorization: token }
      });
      console.log(response.data.message);
      setForm({
        objectId: '',
        productImage: [],
        productName: '',
        description: '',
        colors: [],
        size: [],
        price: ''
      });
      getProducts();
    } catch (error) {
      console.log(error.response?.data?.error || 'Failed to update product');
    }
  };

  const addProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:7000/addProduct', {
        productImage: form.productImage,
        productName: form.productName,
        description: form.description,
        colors: form.colors,
        size: form.size,
        price: form.price
      }, {
        headers: { Authorization: token }
      });
      console.log(response.data.message);
      setForm({
        objectId: '',
        productImage: [],
        productName: '',
        description: '',
        colors: [],
        size: [],
        price: ''
      });
      getProducts();
    } catch (error) {
      console.log("error number one =>", error.response?.data?.error || 'Failed to add product');
      window.alert(error.response?.data?.error)
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSizeClick = () => {
    const valuee = parseInt(sizeInput);
    if (valuee > 99 || valuee < 0 || isNaN(valuee)) {
      window.alert("Please Enter a Value Between 0 - 100");
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        size: [...prevForm.size, valuee]
      }));
      setSizeInput('');
    }
  };

  const handleSizeRemove = (sizeToRemove) => {
    setForm((prevForm) => ({
      ...prevForm,
      size: prevForm.size.filter(size => size !== sizeToRemove)
    }));
  };







  const handleImageClick = () => {
    setForm((prevForm) => ({
      ...prevForm,
      productImage: [...prevForm.productImage, imageInput]
    }));
    setImageInput('');
  };

  const handleImageRemove = (imageToRemove) => {
    setForm((prevForm) => ({
      ...prevForm,
      productImage: prevForm.productImage.filter(image => image !== imageToRemove)
    }));
  };


  const handleColorClick = () => {
    setForm((prevForm) => ({
      ...prevForm,
      colors: [...prevForm.colors, colorInput]
    }));
    setColorInput('');
  };

  const handleColorRemove = (colorToRemove) => {
    setForm((prevForm) => ({
      ...prevForm,
      colors: prevForm.colors.filter(color => color !== colorToRemove)
    }));
  };


  return (
    <div className='owner-container'>
      <h1 className='owner-title'>Owner</h1>
      <div className='owner-products'>
        {products.map((prod, index) => (
          <div key={index} className='product-card'>
            <img src={prod.productImage[0]} alt="image" className='product-image' />
            <h2 className='product-name'>{prod.productName}</h2>
            <p className='product-description'>{prod.description}</p>
            <p className='product-price' style={{ justifyContent: "space-around" }}>Price: Rs. {prod.price}</p>
            <p className='product-colors'>Colors: {prod.colors.join(' - ')}</p>
            <p className='product-sizes'>Sizes: {prod.size.join(' - ')}</p>
            <div className='product-images'>
            </div>
            <button onClick={() => deleteProduct(prod._id)} className='btn-delete'>Delete</button>
            <button
              onClick={() => setForm({
                ...prod,
                objectId: prod._id,
                colors: prod.colors.join(', '),
                size: prod.size,
                productImage: prod.productImage.join(', ')
              })}
              className='btn-update'
            >
              Update
            </button>
          </div>
        ))}
      </div>
      <button onClick={getProducts} className='btn-get-data'>Get Data</button>
      <div className='product-form'>
        <h2>{form.objectId ? 'Update Product' : 'Add Product'}</h2>
        <input
          type="text"
          name="productName"
          value={form.productName}
          onChange={handleFormChange}
          placeholder="Product Name"
          className='form-input'
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleFormChange}
          placeholder="Description"
          className='form-input'
        />
        <input
          type="text"
          name="price"
          value={form.price}
          onChange={handleFormChange}
          placeholder="Price"
          className='form-input'
        />





        <label>Selected Colors - click on the color to remove them:</label>
        <br />
        <div className='size-available' >
          {form.colors.map((color, index) => (
            <button key={index} onClick={() => handleColorRemove(color)}
              style={{ width: "70px" }}
            >{color}</button>
          ))}
        </div>
        <br />
        <div style={{}}>
          <input
            type="text"
            name="size"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="Colors"
            className='form-input'
            style={{ width: "200px" }}
          />
          <br />
          <button onClick={handleColorClick} style={{ width: "100px" }}>Add Color</button>
        </div>
        <br />









        <label>XS = 1 , S = 2 , M = 3 , L = 4 , XL = 5 , XXL = 6</label><br />
        <label>Selected sizes - click on the size to remove them:</label>
        <br />
        <div className='size-available' >
          {form.size.map((size, index) => (
            <button key={index} onClick={() => handleSizeRemove(size)}
              style={{ width: "70px" }}
            >{size}</button>
          ))}
        </div>
        <br />
        <div style={{}}>
          <input
            type="text"
            name="size"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="Sizes only in numbers (For Using The Above Sizes Type Their Assigned Number) (comma separated)"
            className='form-input'
            style={{ width: "200px" }}
          />
          <br />
          <button onClick={handleSizeClick} style={{ width: "100px" }}>Add Size</button>
        </div>
        <br />

        <label>Selected Images - click on the Image to remove them:</label>
        <br />
        <div className='uploadProduct-images' >
          {form.productImage.map((image, index) => (
            <div key={index} style={{ width: "100%" }}>
              <img src={image} alt="image" onClick={() => handleImageRemove(image)} style={{ width: "100%" }} />
            </div>
          ))}
        </div>
        <br />
        <div style={{}}>
          <input
            type="text"
            name="size"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Images only in links"
            className='form-input'
            style={{ width: "200px" }}
          />
          <br />
          <button onClick={handleImageClick} style={{ width: "100px" }}>Add Image</button>
        </div>
        <br />

        <button onClick={form.objectId ? updateProduct : addProduct} className='btn-submit'>
          {form.objectId ? 'Submit Update' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

export default Owner;
