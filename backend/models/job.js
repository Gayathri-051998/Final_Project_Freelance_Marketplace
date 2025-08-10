const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    budget: { type: Number, required: true  },
    category: { type: String },
    deadline: { type: Date },
    tags: [{ type: String }],
  status: { type: String, enum: ['draft', 'active', 'closed'], default: 'active' },
  isArchived: { type: Boolean, default: false },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

