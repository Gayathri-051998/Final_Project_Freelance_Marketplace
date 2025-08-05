const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    terms: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    milestones: [
      {
        title: String,
        amount: Number,
        completed: { type: Boolean, default: false },
      },
    ],
    totalAmount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contract', contractSchema);

