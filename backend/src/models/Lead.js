const mongoose = require('mongoose');
const { calculateLeadScore } = require('../utils/scoreCalculator');

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

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    performedBy: {
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
    leadScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    notes: [noteSchema],
    activity: [activitySchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: isStale - true if updatedAt > 14 days AND status not Won/Lost
leadSchema.virtual('isStale').get(function () {
  if (this.status === 'Won' || this.status === 'Lost') return false;
  const now = new Date();
  const diffDays = Math.floor((now - this.updatedAt) / (1000 * 60 * 60 * 24));
  return diffDays >= 14;
});

// Virtual: staleDays - days since updatedAt
leadSchema.virtual('staleDays').get(function () {
  const now = new Date();
  return Math.floor((now - this.updatedAt) / (1000 * 60 * 60 * 24));
});

// Pre-save hook: calculate lead score
leadSchema.pre('save', function (next) {
  this.leadScore = calculateLeadScore(this);
  next();
});

// Index for search and filtering
leadSchema.index({ leadName: 'text', companyName: 'text', email: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ leadSource: 1 });
leadSchema.index({ assignedSalesperson: 1 });
leadSchema.index({ leadScore: -1 });
leadSchema.index({ followUpDate: 1 });

module.exports = mongoose.model('Lead', leadSchema);
