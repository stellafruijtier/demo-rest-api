import { getDatabase } from '../db.js';

// Create a new event
export function createEvent(eventData) {
  const db = getDatabase();
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO events (title, description, address, date, image, createdAt, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    eventData.title,
    eventData.description,
    eventData.address,
    eventData.date,
    eventData.image ?? null,
    createdAt,
    eventData.user_id
  );

  return getEventById(result.lastInsertRowid);
}

// Get all events
export function getAllEvents() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM events ORDER BY createdAt DESC');
  return stmt.all() || [];
}

// Get a single event by ID
export function getEventById(id) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
  return stmt.get(id) || null;
}

// Update/edit an event
export function updateEvent(id, eventData) {
  const db = getDatabase();

  const updates = [];
  const values = [];

  if (eventData.title !== undefined) {
    updates.push('title = ?');
    values.push(eventData.title);
  }
  if (eventData.description !== undefined) {
    updates.push('description = ?');
    values.push(eventData.description);
  }
  if (eventData.address !== undefined) {
    updates.push('address = ?');
    values.push(eventData.address);
  }
  if (eventData.image !== undefined) {
    updates.push('image = ?');
    values.push(eventData.image);
  }
  if (eventData.date !== undefined) {
    updates.push('date = ?');
    values.push(eventData.date);
  }

  if (updates.length === 0) return getEventById(id);

  const updatedAt = new Date().toISOString();
  updates.push('updatedAt = ?');
  values.push(updatedAt);

  values.push(id);

  const stmt = db.prepare(`
    UPDATE events
    SET ${updates.join(', ')}
    WHERE id = ?
  `);

  const result = stmt.run(...values);
  if (result.changes === 0) return null;

  return getEventById(id);
}

// Delete an event
export function deleteEvent(id) {
  const db = getDatabase();

  const event = getEventById(id);
  if (!event) return null;

  db.prepare('DELETE FROM events WHERE id = ?').run(id);
  return event;
}




