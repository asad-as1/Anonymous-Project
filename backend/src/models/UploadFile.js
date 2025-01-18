const UploadFileSchema = new mongoose.Schema({
    filename: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // URL to the file in Firebase or Cloudinary
      required: true,
    },
    fileType: {
      type: String, // Type of the file, e.g., 'pdf', 'image'
      required: true,
    },
    isPublic: {
      type: Boolean, // Whether the file is public or private
      default: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who uploaded the file
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const UploadFile = mongoose.model('UploadFile', UploadFileSchema);
  module.exports = UploadFile;
  