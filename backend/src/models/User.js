const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  fullName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String, // URL to profile picture (e.g., stored in Firebase or Cloudinary)
  },
  bio: {
    type: String,
    maxlength: 500, // Short bio for the user
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Role-based access control
    default: 'user',
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Reference to posts created by the user
    },
  ],
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note', // Reference to subject-wise notes created by the user
    },
  ],
  uploadedFiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UploadFile', // Reference to uploaded files (PDFs, images, etc.)
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', // Reference to tasks added by the user
    },
  ],
  timetables: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeTable', // Reference to the user's timetables
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function(next) {
  if(this.isModified('password') || this.isNew) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
