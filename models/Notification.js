import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['absence_request', 'request_approved', 'request_rejected', 'other']
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);