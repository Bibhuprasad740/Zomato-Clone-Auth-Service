import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import TryCatch from "../middlewares/trycatch";
import { AuthenticatedRequest } from "../middlewares/isAuth";
import oauth2Client from "../config/google";
import axios from "axios";


const allowedRoles = ['customer', 'rider', 'seller'];
type Role = (typeof allowedRoles)[number];

export const login = TryCatch(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: 'Auth Code is required' });
    }

    const googleResponse = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleResponse.tokens);

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + googleResponse.tokens.access_token);

    const { email, name, picture } = userResponse.data;
    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ name, email, password: 'google', image: picture, role: 'customer' });
        await user.save();
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: '30d' });
    return res.status(200).json({ user, token });
})

export const signup = TryCatch(async (req, res) => {
    const { email, password, picture, name, role } = req.body;
    if (!email || !password || !picture || !name) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    if (role == 'admin') {
        return res.status(403).json({ message: 'Admin signup is not allowed' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword, image: picture, role: 'customer' });
    await newUser.save();
    const token = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return res.status(201).json({ user: newUser, token });
});

export const updateRole = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    await user.save();

    const token = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return res.status(200).json({ user, token });
})

export const getProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from the user document
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({ user: userWithoutPassword });
})
