import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent as deleteEventFromModel,
  } from '../models/events.js';
  import { getDatabase } from '../db.js';
  
  // Utility: non-empty string
  function isNonBlankString(val) {
    return typeof val === 'string' && val.trim().length > 0;
  }
  
  // Controller: Create a new event
  export function create(req, res) {
    try {
      const { title, description, address, date } = req.body;
      const image = req.file; // multer file object (or undefined)
  
      const errors = [];
  
      if (!isNonBlankString(title)) errors.push('Title is required and cannot be blank.');
      if (!isNonBlankString(description)) errors.push('Description is required and cannot be blank.');
      if (!isNonBlankString(address)) errors.push('Address is required and cannot be blank.');
  
      if (!isNonBlankString(date)) {
        errors.push('Date is required and cannot be blank.');
      } else {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
          errors.push('Date must be a valid date string.');
        }
      }
  
      // If you want image to be REQUIRED, keep this:
      if (!image) {
        errors.push('Image is required.');
      }
      // If you want image OPTIONAL instead, delete the block above.
  
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
  
      const eventData = {
        title,
        description,
        address,
        date,
        image: image.filename,     // image is required anyway
        user_id: req.user.id,      // ✅ REQUIRED for DB insert
      };
      
  
      const event = createEvent(eventData);
      res.status(201).json(event);
    } catch (err) {
      res.status(500).json({ error: 'Error creating event' });
    }
  }
  
  // Controller: Get all events
  export function getAll(req, res) {
    try {
      const events = getAllEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching events' });
    }
  }
  
  // Controller: Get single event by ID
  export function getOne(req, res) {
    try {
      const { id } = req.params;
      const event = getEventById(id);
  
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching event' });
    }
  }
  
  // Controller: Edit (update) an event by ID
  export function update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, address, date } = req.body;
      const image = req.file; // multer file object (or undefined)
  
      const errors = [];
  
      if ('title' in req.body && !isNonBlankString(title)) {
        errors.push('Title cannot be blank if provided.');
      }
      if ('description' in req.body && !isNonBlankString(description)) {
        errors.push('Description cannot be blank if provided.');
      }
      if ('address' in req.body && !isNonBlankString(address)) {
        errors.push('Address cannot be blank if provided.');
      }
  
      if ('date' in req.body) {
        if (!isNonBlankString(date)) {
          errors.push('Date cannot be blank if provided.');
        } else {
          const d = new Date(date);
          if (isNaN(d.getTime())) {
            errors.push('Date must be a valid date string if provided.');
          }
        }
      }
  
      // If a file is uploaded, it’s automatically “not blank”.
      // If you need to validate file type/size, do that here instead.
  
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
  
      const eventData = {};
      if ('title' in req.body) eventData.title = title;
      if ('description' in req.body) eventData.description = description;
      if ('address' in req.body) eventData.address = address;
      if ('date' in req.body) eventData.date = date;
      if (image) eventData.image = image.filename; // <-- correct way
  
      const updatedEvent = updateEvent(id, eventData);
  
      if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
      res.json(updatedEvent);
    } catch (err) {
      res.status(500).json({ error: 'Error updating event' });
    }
  }
  
  // Controller: Delete an event by ID
  export function deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const deletedEvent = deleteEventFromModel(id);
  
      if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
      res.json(deletedEvent);
    } catch (err) {
      res.status(500).json({ error: 'Error deleting event' });
    }
  }
  
  export function register(req, res) {
    const { id } = req.params;
    const event = getEventById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
  
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO registrations (event_id, user_id) VALUES (?, ?)');
    const info = stmt.run(id, req.user.id);
  
    if (info.changes > 0) {
      res.status(201).json({ message: 'Registered successfully' });
    } else {
      res.status(500).json({ message: 'Registration failed' });
    }
  }
  
  // (typo fix: unregister)
  export function unregister(req, res) {
    const { id } = req.params;
    const event = getEventById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
  
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM registrations WHERE event_id = ? AND user_id = ?');
    const info = stmt.run(id, req.user.id);
  
    if (info.changes > 0) {
      res.status(200).json({ message: 'Unregistered successfully' });
    } else {
      res.status(500).json({ message: 'Unregistration failed' });
    }
  }