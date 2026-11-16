
const Note = require('../models/noteModel');

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Check whether the title was provided
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Note title is required'
      });
    }

    // Save the note in MongoDB
    const note = await Note.create({
      title: title.trim(),
      content: content || '',
      tags: tags || [],
      user: req.user
    });

    // Send the saved note back to the client
    return res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error.message);

    return res.status(500).json({
      message: 'Server error while creating note'
    });
  }
};


const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Get notes error:', error.message);

    return res.status(500).json({
      message: 'Server error while fetching notes'
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    return res.status(200).json({ note });
  } catch (error) {
    console.error('Get note error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid note ID'
      });
    }

    return res.status(500).json({
      message: 'Server error while fetching note'
    });
  }
};


const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Find the note owned by the logged-in user
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    // Update the title only if it was provided
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          message: 'Title cannot be empty'
        });
      }

      note.title = title.trim();
    }

    // Update the content only if it was provided
    if (content !== undefined) {
      if (typeof content !== 'string') {
        return res.status(400).json({
          message: 'Content must be a string'
        });
      }

      note.content = content;
    }

    // Update the tags only if they were provided
    if (tags !== undefined) {
      if (
        !Array.isArray(tags) ||
        !tags.every(tag => typeof tag === 'string')
      ) {
        return res.status(400).json({
          message: 'Tags must be an array of strings'
        });
      }

      note.tags = tags;
    }

    const updatedNote = await note.save();

    return res.status(200).json({
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid note ID'
      });
    }

    return res.status(500).json({
      message: 'Server error while updating note'
    });
  }
};
// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    return res.status(200).json({
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid note ID'
      });
    }

    return res.status(500).json({
      message: 'Server error while deleting note'
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
