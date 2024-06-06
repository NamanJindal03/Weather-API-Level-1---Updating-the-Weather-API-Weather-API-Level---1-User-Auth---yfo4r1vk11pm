const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'newtonSchool';

const decodeToken = (req, res, next) => {
  try {
    let { token } = req.body;
    console.log(token);
    const decodedToken = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ payload: decodedToken, status: 'Success' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

// Function for user signup
const signup = async (req, res, next) => {
  try {
    // Extract user data from the request body (e.g., username, email, password)
    const {username, email, password} = req.body;
    // Create a new user instance using the User model
    const user = await User.create({email, username, password})
    return res.status(201).json({
      message: "User created successfully",
      status: "success",
      data: user
    })
    // Save the user to the database
    // Handle success and send a success response with user data

    // Handle errors and send an error response
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

// Function for user login
const login = async (req, res, next) => {
  try {
    // Extract user credentials from the request body (e.g., email, password)
    const {email, password} = req.body;
    // Check if both email and password are provided; if not, send an error response
    if(!email || !password){
      return res.status(400).json({
        message: 'Please provide email and password',
        status: "Error"
      })
    }

    const user = await User.findOne({email: email});
    if(!user){
      return res.status(401).json({
        message: 'Invalid email or password',
        status: "Error"
      })
    }
    const isPasswordMatch = bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
      return res.status(401).json({
        message: 'Invalid email or password',
        status: "Error", 
        error: 'Invalid Credentials'
      })
    }
    const jwtToken = jwt.sign({userId: user._id, username: user.username, email: user.email},
      {
        expiresIn: '1d'
      }
    )

    return res.status(200).json({
      token: jwtToken,
      status: 'success',
      message: 'user login successfull'
    })
    // Find the user in the database by their email
    // If the user is not found, send an error response
    // Compare the provided password with the stored password using bcrypt
    // If passwords do not match, send an error response
    // If passwords match, generate a JWT token with user information
    // Send the token in the response
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

module.exports = { login, signup, decodeToken };
