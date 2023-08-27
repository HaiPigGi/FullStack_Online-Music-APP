import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Middleware untuk verifikasi token akses
const verifyToken = (req, res, next) => {
  // Check if user is already authenticated (has a token)
  const authHeader = req.headers['authorization'];
  const existingToken = authHeader && authHeader.split(' ')[1];

  // If user has a valid existing token, verify it and continue
  if (existingToken) {
    jwt.verify(existingToken, SPOTIFY_CLIENT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid access token' });
      }
      req.user = user;
      next();
    });
  } else {
    // If user does not have a valid existing token, generate a new one
    const randomToken = crypto.randomBytes(32).toString('hex'); // Generate a random string
    const newToken = jwt.sign({ data: randomToken }, SPOTIFY_CLIENT_SECRET, { expiresIn: '1h' });

    // Send the new token in the response headers and continue
    res.set('Authorization', `Bearer ${newToken}`);
    
    // Store the token data in req.user
    req.user = { data: randomToken };
    
    next();
  }
};

export default verifyToken;
