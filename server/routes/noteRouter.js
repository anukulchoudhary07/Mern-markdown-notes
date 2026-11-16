const express = require('express');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a note
router.post('/', authMiddleware, createNote);

// Get all notes
router.get('/', authMiddleware, getNotes);

// Get one note
router.get('/:id', authMiddleware, getNoteById);

// Update a note
router.put('/:id', authMiddleware, updateNote);

// Delete a note
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;