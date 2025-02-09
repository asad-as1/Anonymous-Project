import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';
import { upload } from '../../firebase.js';
import Cookies from 'cookies-js';
import NoteCard from '../../components/NoteCard/NoteCard.jsx';
import './MyNotes.css';

const NotesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);

  const token = Cookies.get('user');

  const fetchNotes = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/mynotes/getAllNotes`, { token });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !["audio/mpeg", "video/mp4"].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Invalid file type. Please select a valid file (no MP3 or MP4).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert('Title is required.');
      return;
    }

    if (!textContent && !file) {
      alert('Please provide either text content or a file.');
      return;
    }

    let fileUrl;

    if(file) fileUrl = await upload(file);

    const noteData = {
      title,
      shortNote: textContent,
      fileUrl
    };

    try {
      await axios.post(`${import.meta.env.VITE_URL}/mynotes/note`, { token, noteData });
      alert('Note saved successfully!');
      setShowForm(false);
      setTitle('');
      setTextContent('');
      setFile(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save the note.');
    }
  };

  return (
    <div className="notes-page-container">
      <div className="add-note-button-container">
        <Button variant="contained" onClick={() => setShowForm(true)} startIcon={<AiOutlinePlus />}>
          Add Note
        </Button>
      </div>

      {showForm && (
        <div className="note-form-container">
          <form onSubmit={handleSubmit} className="note-form">
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Enter your text (optional)"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              multiline
              rows={6}
              fullWidth
              margin="normal"
            />
            <TextField
              type="file"
              inputProps={{ accept: '.pdf,.txt,.docx' }}
              onChange={handleFileChange}
              fullWidth
              margin="normal"
            />
            <div className="note-form-actions">
              <Button variant="outlined" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Note
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-list-container">
        {notes.map((note, index) => (
          <NoteCard key={index} title={note.title} id={note._id} shortNote={note.shortNote} fileUrl={note.fileUrl} />
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
