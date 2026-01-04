// User model (functional style, no classes)

import { getDatabase } from '../db.js';
import bcrypt from 'bcryptjs';

export async function createUser(userData) {
  const db = getDatabase();

  const createdAt = new Date().toISOString();

  // Hash the password before storing using async bcrypt.hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Insert user into database
  const stmt = db.prepare(`
    INSERT INTO users (email, password, createdAt)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(userData.email, hashedPassword, createdAt);

  // Fetch and return the created user
  const user = findUserById(result.lastInsertRowid);

  return user;
}

// Asynchronous function to verify user credentials using bcrypt
export async function verifyUserCredentials(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  // Compare plain password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }

  // Omit password from user object when returning
  const { password: _pw, ...userSafe } = user;
  return userSafe;
}


// Find user by email
export function findUserByEmail(email) {
  const db = getDatabase();
  
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  
  return user || null;
}

// Find user by ID
export function findUserById(id) {
  const db = getDatabase();
  
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(id);
  
  return user || null;
}

// Validate user credentials
export function validateUserCredentials(email, password) {
  const user = findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  // TODO: Compare hashed password in production (use bcrypt)
  if (user.password !== password) {
    return null;
  }
  
  return user;
}

