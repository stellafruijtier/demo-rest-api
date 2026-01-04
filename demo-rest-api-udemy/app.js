import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'

import { initializeDatabase } from './db.js';
import eventsRoutes from './routes/events.js';
import usersRoutes from './routes/users.js';

// Needed for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static('public/images'));


// Routes
app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
});

