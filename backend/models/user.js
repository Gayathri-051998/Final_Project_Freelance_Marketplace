const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'freelancer'], required: true },
    profile: {
        bio: { type: String },

      skills: [String],
      portfolio: String,
      company: String, // for clients
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

