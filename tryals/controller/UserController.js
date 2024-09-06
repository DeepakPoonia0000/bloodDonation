const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/UserSchema');

const jwtSecret = 'Thr0bZyphrnQ8vkJumpl3BaskEel@ticsXzylN!gmaPneuma';
const customer = 'jI$3Mv@8kP&lD6G#9oK!uS^zW0YdR*L1fT7W#bNp8qXvE$2';
const shop = 'R@7yU5vK*9#L^eP&1!sF8$2B0oQmWzD4xJ%pC3gN#6T$Y'


const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        if (user.token !== token) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.Id = decodedToken.id;
        req.shopName = user.shopName;
        req.role = user.role;
        // console.log("Token verified successfully user details are\n" ,"userID",req.Id ,"\n User ShopName",req.shopName  );
        next();
    } catch (error) {
        console.error('Failed to verify token:', error);
        return res.status(500).json({ message: 'Failed to verify token', error: error.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { email, name, shopName, password, pincode, address, location, role } = req.body;

        if (role === customer) {
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are necessary for customer' });
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: hashedPassword,
                role
            });

            console.log(newUser);
            res.status(201).json({ newUser });

        } else if (role === shop) {
            // Ensure all fields are provided for shop
            if (!name || !password || !email || !shopName || !pincode || !address || !location) {
                return res.status(400).json({ error: 'All fields are necessary for shop' });
            }

            // Check if email or name already exists
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            const existingUserName = await User.findOne({ shopName });
            if (existingUserName) {
                return res.status(400).json({ error: 'shop name already exists' });
            }

            // Create shop with all fields
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                name,
                shopName,
                password: hashedPassword,
                pincode,
                address,
                location,
                role
            });

            console.log(newUser);
            res.status(201).json({ newUser });

        } else {
            return res.status(400).json({ error: 'Invalid role specified' });

        }

    } catch (error) {
        console.error('Failed to add user:', error);
        res.status(500).json({ error: error.message });
        console.log(error)
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '60d' });
            user.token = token;
            await user.save();
            role = user.role;
            console.log("User logged in:", user);
            return res.status(200).json({ message: 'Login successful', token, role });

        } else {
            return res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: error.message });
    }
};

const getShops = async (req, res) => {
    try {
        const role = req.role;
        const { pincode, page = 1, limit = 10 } = req.query;

        console.log('Role from request:', role);

        let shops;

        const pincodeInt = parseInt(pincode, 10);
        const minPincode = pincodeInt - 6;
        const maxPincode = pincodeInt + 6;
        if (pincode) {
            shops = await User.find(
                {
                    role: "R@7yU5vK*9#L^eP&1!sF8$2B0oQmWzD4xJ%pC3gN#6T$Y",
                    pincode: { $gte: minPincode, $lte: maxPincode }
                },
                'shopName address pincode location'
            )
                .skip((page - 1) * limit)
                .limit(limit);
        } else {
            shops = await User.find(
                { role: "R@7yU5vK*9#L^eP&1!sF8$2B0oQmWzD4xJ%pC3gN#6T$Y" },
                'shopName address pincode location'
            )
                .skip((page - 1) * limit)
                .limit(limit);
        }

        const totalShops = await User.countDocuments(
            {
                role: "R@7yU5vK*9#L^eP&1!sF8$2B0oQmWzD4xJ%pC3gN#6T$Y",
                ...(pincode ? { pincode: { $gte: minPincode, $lte: maxPincode } } : {})
            }
        );

        if (shops.length === 0) {
            return res.status(404).json({ error: 'No shops found' });
        }

        console.log('Shops found by pincode :', shops);
        res.status(200).json({ shops, role, total: totalShops });
    } catch (error) {
        console.error('Failed to get shops:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { addUser, loginUser, getShops, verifyToken };
