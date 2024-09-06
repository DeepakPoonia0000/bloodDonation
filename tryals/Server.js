const express = require('express');
const cors = require('cors');
const { addUser, loginUser, getShops, verifyToken } = require('./controller/UserController')
const { addProduct, updateProductByObjectId, deleteProductByObjectId, getProductsByShopId, getProductByShopName, getProductsByProductId } = require('./controller/productController');
const dbConnection = require('./dbConnection');
const { verify } = require('jsonwebtoken');

const app = express();
const PORT = 7000;

dbConnection();

app.use(cors());
app.use(express.json());


app.post('/addUser', addUser);
app.post('/loginUser', loginUser);

app.post('/addProduct', verifyToken, addProduct);
app.get('/products', verifyToken, getProductsByShopId);
app.delete('/delete', verifyToken, deleteProductByObjectId);
app.put('/update', verifyToken, updateProductByObjectId);

app.get('/details', getProductByShopName);
app.get('/productDetails', getProductsByProductId);
app.get('/shops', verifyToken, getShops);

app.listen(PORT, (error) => {
    if (!error) {
        console.log('Server is running successfully on port ' + PORT);
    } else {
        console.error('Error occurred, server cannot start: ' + error);
    }
});
