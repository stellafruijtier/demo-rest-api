import express from 'express';
import multer from 'multer';
import path from 'path';

import * as events from '../controllers/events-controller.js';
import { authenticateToken as authenticate } from '../util/auth.js';

const router = express.Router();

// Multer config (stores images in ./uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/images'),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
  

// (Optional but recommended) only allow image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({ storage, fileFilter });

// Create an event
router.post('/', authenticate, upload.single('image'), events.create);

// Edit an event by id
router.put('/:id', authenticate, upload.single('image'), events.update);

// Delete an event by id
router.delete('/:id', authenticate, events.deleteEvent);

// Get all events
router.get('/', events.getAll);

// Get an event by id
router.get('/:id', events.getOne);

router.post('/:id/register', authenticate, events.register);

export default router;

