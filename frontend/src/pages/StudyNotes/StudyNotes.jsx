import React, { useState } from "react";
import "./StudyNotes.css";


const StudyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleAddNote = () => {
    if (!title || !description || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      description,
      file,
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setDescription("");
    setFile(null);
    setShowModal(false);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="study-notes-container">
      <h1>Study Notes Sharing</h1>

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <button
          onClick={() => setShowModal(true)}
          className="share-notes-button"
        >
          Share Notes
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal-button"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2>Share Your Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-field"
            />
            <input
              type="file"
              accept=".pdf,.txt,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />
            <button onClick={handleAddNote} className="submit-note-button">
              Submit Note
            </button>
          </div>
        </div>
      )}

      {/* Notes Display Section */}
      <div className="notes-container">
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            <h2 className="note-title">{note.title}</h2>
            <p className="note-description">{note.description}</p>
            {note.file && (
              <a
                href={URL.createObjectURL(note.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="view-note-button"
              >
                View Note
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyNotes;
