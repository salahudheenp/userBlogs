const User = require('../models/userModel'); // Assuming you have a user model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Blog = require('../models/blogModel');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
console.log(user,"*****************");

    // Debugging logs
    console.log('Password from request:', password);
    console.log('Password from user:', user.password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { registerUser, userLogin };

const getUsersWithBlogs = async (req, res) => {
  try {
    console.log("!!!!!!!!!!!!!!!!!!!!!!");
    
    const users = await User.find()
console.log(users,"$$$$$$$$$$$$$$$$$$");
    const blogs = await Blog.find({ author: users[0]._id })
console.log(blogs,"@@@@@@@@@@@@@@############");

    const UsersWithBlogs = {username : users[0].username, blogs:blogs}
    console.log(UsersWithBlogs,"))))))))))))))");

    
    res.status(200).json(UsersWithBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, userLogin, getUsersWithBlogs };
