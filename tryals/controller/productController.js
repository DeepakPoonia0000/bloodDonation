// ProductController.js

const Product = require('../model/ProductSchema');
const User = require('../model/UserSchema')

const addProduct = async (req, res) => {
    try {
        const { productImage, productName, description, colors, size, price } = req.body;
        const shopId = req.Id;
        const shopName = req.shopName;
        const user = await User.findById(shopId)
        const role = user.role;
        console.log("user details in add product are\n", "userID", shopId, "\n User ShopName", shopName, "\n ROle", role);


        if (role === 'R@7yU5vK*9#L^eP&1!sF8$2B0oQmWzD4xJ%pC3gN#6T$Y') {
            if (!productImage || !productName || !description || !colors || !size || !price) {
                return res.status(400).json({ error: 'All product details are required' });
            }


            const newProduct = await Product.create({
                shopId, shopName, productImage, productName, description, colors, size, price
            });
            console.log(newProduct);
            res.status(201).json({ message: 'Product added successfully', product: newProduct });
        } else {
            res.status(500).json('You are not authorized to add any product')
        }
    } catch (error) {
        console.error('Failed to add product:', error);
        res.status(500).json({ error: error.message });
    }
};

const getProductsByShopId = async (req, res) => {
    try {
        const shopId = req.Id;
        const products = await Product.find({ shopId });
        console.log(products)
        res.status(200).json(products);
    } catch (error) {
        console.error('Failed to get products:', error);
        res.status(500).json({ error: error.message });
    }
};

const getProductByShopName = async (req, res) => {
    try {
        const { shopName } = req.query;

        if (!shopName) {
            return res.status(400).json({ error: 'shopName is required' });
        }

        //products based on shopName and dont send the shopId
        const products = await Product.find({ shopName }).select('-shopId');

        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found for this shop' });
        }

        console.log(products);
        res.status(200).json(products);
    } catch (error) {
        console.error('Failed to get products:', error);
        res.status(500).json({ error: error.message });
    }
};

const getProductsByProductId = async(req,res) =>{
    try {
        const {productId} = req.query;

        const product =await Product.findById(productId)

        if(!product){
            return res.status(404).json({ error: 'This product is not available anymore.' });
        }
        console.log(product)
        res.status(200).json(product);

    } catch (error) {
        res.status(500).json(error)
    }
}


const deleteProductByObjectId = async (req, res) => {
    try {
        const { productId } = req.body;
        const shopId = req.Id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.shopId !== shopId) {
            return res.status(403).json({ error: 'You do not have permission to delete this product' });
        }

        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateProductByObjectId = async (req, res) => {
    try {
        const { productId, productImage, productName, description, colors, size, price } = req.body;
        const shopId = req.Id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.shopId !== shopId) {
            return res.status(403).json({ error: 'You do not have permission to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { productImage, productName, description, colors, size, price },
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Failed to update product:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProduct, getProductsByShopId, getProductByShopName, getProductsByProductId, deleteProductByObjectId, updateProductByObjectId };