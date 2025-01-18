const TaskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    dueDate: {
      type: Date, // Deadline or scheduled time for the task
    },
    isCompleted: {
      type: Boolean,
      default: false, // Whether the task is completed
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the task
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Task = mongoose.model('Task', TaskSchema);
  module.exports = Task;
  