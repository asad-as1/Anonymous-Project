import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "cookies-js";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "./Event.css";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Edit, Delete, Add, Save } from "@mui/icons-material";

const EventTimeline = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [editingEvent, setEditingEvent] = useState(null); // Event being edited
  const [selectedEvent, setSelectedEvent] = useState(null); // Stores the original event before editing
  const [open, setOpen] = useState(false); // Dialog state

  const token = Cookies.get("user");

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/events/fetchAll`,
        { token }
      );
      setEvents(response?.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const isCompleted = (endTime) => new Date(endTime) < new Date();

  // Delete an event
  const handleDelete = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/events/delete/${id}`, { token });
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event!");
    }
  };

  // Add a new event
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_URL}/events/newEvent`, {
        ...newEvent,
        token,
      });
      await fetchEvents();
      setNewEvent({ title: "", startTime: "", endTime: "", description: "" });
      alert("Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    }
  };

  // Open update dialog with selected event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedEvent(event); // Store original event data
    setOpen(true);
  };

  // Update an existing event
  const handleUpdateEvent = async () => {
    if (!editingEvent || !editingEvent.title.trim() || !editingEvent.description.trim()) {
      alert("Title or Description cannot be empty!");
      return;
    }

    const updatedFields = {};

    // Only include fields that have been modified
    if (editingEvent.title !== selectedEvent?.title) {
      updatedFields.title = editingEvent.title;
    }
    if (editingEvent.description !== selectedEvent?.description) {
      updatedFields.description = editingEvent.description;
    }
    if (editingEvent.startTime !== selectedEvent?.startTime) {
      updatedFields.startTime = editingEvent.startTime;
    }
    if (editingEvent.endTime !== selectedEvent?.endTime) {
      updatedFields.endTime = editingEvent.endTime;
    }

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes detected!");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_URL}/events/${editingEvent._id}`, {
        ...updatedFields,
        token,
      });

      await fetchEvents(); // Refresh events after update
      setOpen(false);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  return (
    <div className="timeline-container">
      <h2 className="timeline-title">📅 Event Timeline</h2>

      <div className="add-event-form">
        <TextField
          label="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          fullWidth
          required
          margin="dense"
        />
        <TextField
          label="Start Time"
          type="datetime-local"
          value={newEvent.startTime}
          onChange={(e) =>
            setNewEvent({ ...newEvent, startTime: e.target.value })
          }
          fullWidth
          required
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Time"
          type="datetime-local"
          value={newEvent.endTime}
          onChange={(e) =>
            setNewEvent({ ...newEvent, endTime: e.target.value })
          }
          fullWidth
          required
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
          fullWidth
          multiline
          rows={2}
          margin="dense"
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleAddEvent}
          fullWidth
        >
          Add Event
        </Button>
      </div>

      <VerticalTimeline>
        {events?.map((event) => (
          <VerticalTimelineElement
            key={event._id}
            date={`${new Date(event.startTime).toLocaleDateString()} - ${new Date(event.endTime).toLocaleDateString()}`}
            iconStyle={{
              background: isCompleted(event.endTime) ? "green" : "blue",
              color: "#fff",
            }}
            className="timeline-element"
          >
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p
              className={`status ${
                isCompleted(event.endTime) ? "completed" : "in-progress"
              }`}
            >
              {isCompleted(event.endTime) ? "✅ Completed" : "⏳ In Progress"}
            </p>
            <div className="button-group">
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Edit />}
                onClick={() => handleEditEvent(event)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </Button>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      {/* Update Event Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editingEvent?.title || ""}
            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            value={editingEvent?.startTime || ""}
            onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            value={editingEvent?.endTime || ""}
            onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={editingEvent?.description || ""}
            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateEvent} color="primary" startIcon={<Save />}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventTimeline;
