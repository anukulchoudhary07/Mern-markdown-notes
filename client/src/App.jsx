
import './App.css';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import API from './api/axios';

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from './service/noteService';

function App() {
  // Note states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );
  const [showRegister, setShowRegister] = useState(false);

  // Registration states
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Loading states
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Application error
  const [appError, setAppError] = useState('');

  // Clear editor fields
  const clearEditor = () => {
    setTitle('');
    setContent('');
    setTags('');
    setEditingNoteId(null);
  };

  // Fetch notes when user logs in
  useEffect(() => {
    const loadNotes = async () => {
      setLoadingNotes(true);
      setAppError('');

      try {
        const data = await getNotes();
        setNotes(data.notes);
      } catch (error) {
        console.error('Error loading notes:', error);

        setAppError(
          error.response?.data?.message ||
          'Unable to load notes. Please try again.'
        );
      } finally {
        setLoadingNotes(false);
      }
    };

    if (isLoggedIn) {
      loadNotes();
    }
  }, [isLoggedIn]);

  // Register user
  const handleRegister = async (e) => {
    e.preventDefault();

    if (authLoading) return;

    setAuthLoading(true);
    setAppError('');

    try {
      const response = await API.post('/users/register', {
        name,
        email: registerEmail,
        password: registerPassword
      });

      alert(response.data.message || 'Registration successful!');

      setShowRegister(false);
      setName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (error) {
      setAppError(
        error.response?.data?.message || 'Registration failed.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Login user
  const handleLogin = async (e) => {
    e.preventDefault();

    if (authLoading) return;

    setAuthLoading(true);
    setAppError('');

    try {
      const response = await API.post('/users/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);

      setEmail('');
      setPassword('');
    } catch (error) {
      setAppError(
        error.response?.data?.message || 'Login failed.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setNotes([]);
    setAppError('');
    clearEditor();
  };

  // Save or update note
  const handleSaveNote = async () => {
    if (!title.trim()) {
      setAppError('Please enter a note title.');
      return;
    }

    if (savingNote) return;

    setSavingNote(true);
    setAppError('');

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    const noteData = {
      title: title.trim(),
      content,
      tags: [...new Set(tagsArray)]
    };

    try {
      if (editingNoteId !== null) {
        await updateNote(editingNoteId, noteData);
      } else {
        await createNote(noteData);
      }

      const data = await getNotes();
      setNotes(data.notes);

      clearEditor();
    } catch (error) {
      console.error('Save note error:', error);

      setAppError(
        error.response?.data?.message ||
        'Unable to save note. Please try again.'
      );
    } finally {
      setSavingNote(false);
    }
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    if (deletingNoteId !== null) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmDelete) return;

    setDeletingNoteId(id);
    setAppError('');

    try {
      await deleteNote(id);

      const data = await getNotes();
      setNotes(data.notes);

      if (editingNoteId === id) {
        clearEditor();
      }
    } catch (error) {
      console.error('Delete note error:', error);

      setAppError(
        error.response?.data?.message ||
        'Unable to delete note. Please try again.'
      );
    } finally {
      setDeletingNoteId(null);
    }
  };

  // Load an existing note into editor
  const handleEditNote = (note) => {
    setTitle(note.title);
    setContent(note.content || '');
    setTags((note.tags || []).join(', '));
    setEditingNoteId(note._id);
    setAppError('');

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Start a new note
  const handleNewNote = () => {
    clearEditor();
    setAppError('');
  };

  // Login and registration screen
  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">

          {appError && (
            <div className="error-message">
              <span>{appError}</span>
              <button
                type="button"
                onClick={() => setAppError('')}
              >
                ×
              </button>
            </div>
          )}

          {showRegister ? (
            <>
              <h2>Create Account</h2>
              <p>Register to start using Markdown Notes</p>

              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Create a password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={authLoading}>
                  {authLoading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setAppError('');
                  }}
                  disabled={authLoading}
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Welcome Back</h2>
              <p>Login to access your Markdown Notes</p>

              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" disabled={authLoading}>
                  {authLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(true);
                    setAppError('');
                  }}
                  disabled={authLoading}
                >
                  Register
                </button>
              </p>
            </>
          )}

        </div>
      </div>
    );
  }

  // Main notes application
  return (
    <div className="app">

      {/* Application error */}
      {appError && (
        <div className="error-message">
          <span>{appError}</span>
          <button
            type="button"
            onClick={() => setAppError('')}
          >
            ×
          </button>
        </div>
      )}

      {/* Application header */}
      <header className="header">
        <h1>Markdown Notes</h1>

        <div className="header-actions">
          <button onClick={handleNewNote}>
            + New Note
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Notes section */}
      <section className="notes-section">
        <h2>My Notes ({notes.length})</h2>

        {loadingNotes && (
          <p className="status-message">Loading notes...</p>
        )}

        <div className="notes-list">

          {loadingNotes ? null : notes.length === 0 ? (
            <p className="empty-message">
              No notes yet. Create your first note!
            </p>
          ) : (
            notes.map((note) => (
              <div className="note-card" key={note._id}>
                <h3>{note.title}</h3>

                {/* Note tags */}
                {note.tags?.length > 0 && (
                  <div className="note-tags">
                    {note.tags.map((tag, index) => (
                      <span
                        className="tag"
                        key={`${tag}-${index}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Markdown content */}
                <div className="note-markdown">
                  <ReactMarkdown>
                    {note.content || ''}
                  </ReactMarkdown>
                </div>

                {/* Note actions */}
                <div className="note-actions">
                  <button
                    onClick={() => handleEditNote(note)}
                    disabled={deletingNoteId !== null}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    disabled={deletingNoteId !== null}
                  >
                    {deletingNoteId === note._id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}

        </div>
      </section>

      {/* Note editor */}
      <section className="editor-section">
        <h2>
          {editingNoteId !== null
            ? 'Edit Note'
            : 'Create a New Note'}
        </h2>

        <input
          type="text"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Tags input */}
        <input
          type="text"
          placeholder="Enter tags separated by commas (e.g. Work, Study, Personal)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Markdown editor and preview */}
        <div className="editor-container">

          <div className="markdown-input">
            <h3>Write Markdown</h3>

            <textarea
              placeholder="Write your note in Markdown..."
              rows="12"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="markdown-preview">
            <h3>Live Preview</h3>

            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>

        </div>

        {/* Editor buttons */}
        <div className="editor-actions">
          <button
            onClick={handleSaveNote}
            disabled={savingNote}
          >
            {savingNote
              ? 'Saving...'
              : editingNoteId !== null
                ? 'Update Note'
                : 'Save Note'}
          </button>

          {editingNoteId !== null && (
            <button
              className="cancel-button"
              onClick={handleNewNote}
              disabled={savingNote}
            >
              Cancel Editing
            </button>
          )}
        </div>
      </section>

    </div>
  );
}

export default App;
