// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Carousel } from 'react-responsive-carousel';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the styles
// import '../Styles/ProductDetails.css'
// import { useLocation } from 'react-router-dom';

// const ProductDetails = () => {
//   const [product, setProduct] = useState(null); // Initialize as null instead of an empty array
//   const [toggle, setToggle] = useState(false)
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const productId = searchParams.get('productId');

//   const getProduct = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:7000/productDetails', {
//         headers: { Authorization: token },
//         params: {
//           productId,
//         },
//       });
//       console.log(response);
//       setProduct(response.data); // Save the product data

//     } catch (error) {
//       console.log(error.response?.data?.error || 'Product Fetching Failed');
//     }
//   };

//   const imageToggle = () => {
//     setToggle(!toggle)
//   }

//   useEffect(() => {
//     getProduct();
//   }, []);

//   if (!product) {
//     return <p>No product available.</p>;
//   }

//   return (<div className="productDetails-container">
//     <div className="productDetails-carousel">
//       <Carousel
//         showArrows={false}
//         showThumbs={false}
//         infiniteLoop={true}
//         useKeyboardArrows={true}
//         autoPlay={true}
//         stopOnHover={true}
//         interval={3000}
//       >
//         {product.productImage?.length > 0 ? (
//           product.productImage.map((image, imgIndex) => (
//             <div key={imgIndex}>
//               <img src={image}
//                 alt={product.productName}
//                 onClick={imageToggle}

//               />
//             </div>
//           ))
//         ) : (
//           <p>No images available for this product.</p>
//         )}
//       </Carousel>
//     </div>
//     <div className="productDetails-details">
//       <h2>Name: {product.productName}</h2>
//       <p>Details: {product.description}</p>
//       <p>Price: Rs. {product.price}</p>
//       <p>Colors: {product.colors.join(' - ')}</p>
//       <p>Sizes: {product.size.join(' - ')}</p>
//       <p>Date Added: {new Date(product.timeOfAdding).toLocaleString()}</p>
//     </div>
//   </div>
//   );
// };

// export default ProductDetails;







import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the styles
import '../Styles/ProductDetails.css'
import { useLocation } from 'react-router-dom';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [toggle, setToggle] = useState(false)
  const sizeMapping = {
    1: 'XS',
    2: 'S',
    3: 'M',
    4: 'L',
    5: 'XL',
    6: 'XXL'
  };
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('productId');

  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:7000/productDetails', {
        headers: { Authorization: token },
        params: {
          productId,
        },
      });
      setProduct(response.data);

    } catch (error) {
      console.log(error.response?.data?.error || 'Product Fetching Failed');
    }
  };

  const imageToggle = () => {
    setToggle(!toggle)
  }

  useEffect(() => {
    getProduct();
  }, []);

  if (!product) {
    return <p>No product available.</p>;
  }

  return (
    <div className="productDetails-container">
      <div className="productDetails-carousel">
        <Carousel
          showArrows={false}
          showThumbs={true}
          infiniteLoop={true}
          useKeyboardArrows={true}
          autoPlay={true}
          stopOnHover={true}
          interval={2000}
        >
          {product.productImage?.length > 0 ? (
            product.productImage.map((image, imgIndex) => (
              <div key={imgIndex}>
                <img src={image}
                  alt={product.productName}
                  onClick={imageToggle}
                />
              </div>
            ))
          ) : (
            <p>No images available for this product.</p>
          )}
        </Carousel>
      </div>
      <div className="productDetails-details">
        <h1>{product.productName}</h1>
        <p className="product-price">
          <span className="original-price">Rs. {((product.price / 100) * 85).toFixed(2)}</span>
          <span className="discounted-price">Rs. {product.price}</span><br />
        </p>
        <span className="discounted-price">{product.description}</span>
        <div className="size-options">
          <h4>Size Available:</h4>
          <div className="size-list">
            {product.size.map((size, index) => (
              <button key={index} className="size-button">
                {sizeMapping[size] || size}
              </button>
            ))}
          </div>
        </div>
        <div className="color-options">
          <h4>Color Available:</h4>
          <div className="color-list">
            {product.colors.map((color, index) => (
              <button key={index} className="color-button" style={{backgroundColor:`${color}`}}>{color}</button>
            ))}
          </div>
        </div>
        <button className="add-to-cart-button">Add to cart</button>
        <div className="offers-section">
          <p>Flat 5% off! Up to ₹200 OFF! on your first purchase. Code: CODE1</p>
          <p>Flat 10% Off on minimum order value of ₹2299/- Code: FLAT10</p>
          <p>Flat 15% Off on minimum purchase of 3299/- Code: FLAT15</p>
          <p>Flat 20% Off on minimum purchase of 4500/- Code: FLAT20</p>
        </div>
        <div className="product-info">
          <p>Fit: Flare fit | High Waist | Regular Length</p>
          <p>Fabric specification: 90% Cotton 8% Poly 2% Elastane</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
