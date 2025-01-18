const TimeTableSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true, // Name of the timetable (e.g., "Weekly Schedule")
      maxlength: 100,
    },
    events: [
      {
        title: {
          type: String, // Name of the event
          required: true,
        },
        startTime: {
          type: Date, // Start time of the event
          required: true,
        },
        endTime: {
          type: Date, // End time of the event
          required: true,
        },
        description: {
          type: String, // Description of the event
          maxlength: 500,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the timetable
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const TimeTable = mongoose.model('TimeTable', TimeTableSchema);
  module.exports = TimeTable;
  