import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { upload } from "../../firebase.js";
import { getStorage, ref, deleteObject } from "firebase/storage";
import "./StudyNotes.css";
import Cookie from "cookies-js";

const StudyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null); // Use null instead of 0 initially
  const token = Cookie.get("user");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserProfile();
        await fetchNotes();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/user/profile`,
        { token }
      );
      setUserProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/notes/getAllNotes`,
        { token }
      );
      // console.log(response.data)
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async () => {
    if (!title || !description || !file) {
      Swal.fire(
        "Incomplete Data",
        "Please fill in all fields and upload a file.",
        "error"
      );
      return;
    }

    try {
      const fileUrl = await upload(file, (progress) =>
        setUploadProgress(progress)
      );

      const newNote = { title, description, file: fileUrl };
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/notes/studynotes`,
        {
          newNote,
          token,
        }
      );
      // console.log(response)

      // setNotes([response.data, ...notes]);
      fetchNotes();
      setTitle("");
      setDescription("");
      setFile(null);
      setUploadProgress(null);
      setShowModal(false);
      Swal.fire("Success", "Your note has been added successfully.", "success");
    } catch (error) {
      console.error("Error adding note:", error);
      Swal.fire("Error", "Failed to add note. Please try again.", "error");
    }
  };

  const handleDeleteNote = async (noteId, fileUrl) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${import.meta.env.VITE_URL}/notes/deleteNote`, {
            noteId,
            token,
          });

          const storage = getStorage();
          const filePath = decodeURIComponent(
            fileUrl.split("/").pop().split("?")[0]
          );
          const storageRef = ref(storage, filePath);
          await deleteObject(storageRef);

          setNotes(notes.filter((note) => note._id !== noteId));
          Swal.fire(
            "Deleted!",
            "Your note and file have been deleted.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting note:", error);
          Swal.fire(
            "Error",
            "Failed to delete note. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      if (["mp3", "mp4"].includes(extension)) {
        Swal.fire(
          "Invalid File Type",
          "Audio (mp3) and video (mp4) files are not allowed.",
          "error"
        );
        e.target.value = "";
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="study-notes-container">
      <h1 className="first">Study Notes Sharing</h1>

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
              onChange={handleFileChange}
              className="file-input"
            />
            {uploadProgress !== null && (
              <div>
                <div className="upload-progress-bar-container">
                  <div
                    className="upload-progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="upload-progress-text">
                  {uploadProgress}% Uploaded
                </p>
              </div>
            )}

            <button onClick={handleAddNote} className="submit-note-button">
              Submit Note
            </button>
          </div>
        </div>
      )}

      <div className="notes-container">
        {filteredNotes.map((note) => (
          <div key={note._id} className="note-card">
            <h2 className="note-title">{note.title}</h2>
            <p className="note-description">{note.description}</p>
            <p className="uploaded-by">
              Uploaded by: {note?.author?.username || "Unknown"}
            </p>
            {note.file && (
              <a
                href={note.file}
                target="_blank"
                rel="noopener noreferrer"
                className="view-note-button"
              >
                View Note
              </a>
            )}
            {(note.author?._id === userProfile?._id ||
              userProfile?.role === "admin") && (
              <button
                onClick={() => handleDeleteNote(note._id, note.file)}
                className="delete-note-button"
              >
                Delete Note
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyNotes;
