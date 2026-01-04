import { createUser, findUserByEmail, verifyUserCredentials } from '../models/user.js';
import { generateJWT } from '../util/auth.js';

// Signup controller

export async function signup(req, res) {
  try {
    const { email, password } = req.body;

    // Trim the input values to handle spaces-only and falsy values
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPassword = typeof password === 'string' ? password.trim() : '';

    // Validate input: check for empty strings or only blanks
    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required and cannot be empty or just spaces'
      });
    }

    // Validate email format using a basic regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format'
      });
    }

    // Validate password length
    if (trimmedPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists (email must not be taken)
    const existingUser = findUserByEmail(trimmedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (createUser is async)
    const user = await createUser({ email: trimmedEmail, password: trimmedPassword });

    // Optionally verify credentials using verifyUserCredentials (not strictly necessary right after creation,
    // but included as per instruction to use verifyUserCredentials)
    const verifiedUser = await verifyUserCredentials(trimmedEmail, trimmedPassword);

    if (!verifiedUser) {
      // This should not normally occur
      return res.status(500).json({
        success: false,
        message: 'Error verifying user after creation'
      });
    }

    // Generate JWT
    const token = generateJWT(verifiedUser);

    // Return user data (do not include password) and token
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        createdAt: verifiedUser.createdAt
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Login controller
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Verify credentials using bcrypt
    const user = await verifyUserCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = generateJWT(user);

    // Return user data (without password) and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      },
      token: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};
