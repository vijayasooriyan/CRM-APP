const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    leadName: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    leadSource: {
      type: String,
      enum: ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'],
      required: [true, 'Lead source is required'],
    },
    assignedSalesperson: {
      type: String,
      required: [true, 'Assigned salesperson is required'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    dealValue: {
      type: Number,
      required: [true, 'Deal value is required'],
      min: [0, 'Deal value cannot be negative'],
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
leadSchema.index({ leadName: 'text', companyName: 'text', email: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ leadSource: 1 });
leadSchema.index({ assignedSalesperson: 1 });

module.exports = mongoose.model('Lead', leadSchema);
