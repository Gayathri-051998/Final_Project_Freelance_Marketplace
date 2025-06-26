const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    budget: { type: Number },
    category: { type: String },
    deadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

