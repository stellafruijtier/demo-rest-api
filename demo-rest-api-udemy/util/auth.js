import jwt from 'jsonwebtoken';

// Secret key for signing JWTs (in production, use environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// Token expiration time (e.g., '1h' for 1 hour)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Generate a JWT containing user's id and email.
 * @param {Object} user - The user object. Must contain 'id' and 'email'
 * @returns {string} - Signed JWT token
 */
export function generateJWT(user) {
  const payload = {
    id: user.id,
    email: user.email
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT and return the decoded payload if valid.
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} - Decoded payload if valid, otherwise null
 */
export function verifyJWT(token) {
    return jwt.verify(token, JWT_SECRET);
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }
    const token = authHeader.split(' ')[1]; 
    try {
        const decoded = verifyJWT(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
