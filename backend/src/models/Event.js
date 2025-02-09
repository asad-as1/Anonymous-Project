const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    events: [
      {
        title: {
          type: String, 
          required: true,
        },
        startTime: {
          type: Date, 
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
        description: {
          type: String, 
          maxlength: 500,
        },
        isCompleted: {
          type: Boolean,
          default: false, 
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Event = mongoose.model('Event', EventSchema);
  module.exports = Event;
  