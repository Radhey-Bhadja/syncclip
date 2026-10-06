const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
  // Unique 6-digit code or custom short URL key
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Main clipboard text / code snippet content
  content: {
    type: String,
    required: true
  },
  // Optional password hash for protected clips
  passwordHash: {
    type: String,
    default: null
  },
  // Burn after reading flag (deletes clip after 1 view)
  burnAfterReading: {
    type: Boolean,
    default: false
  },
  // Retention duration in seconds (null means 'Never')
  retentionSeconds: {
    type: Number,
    default: null
  },
  // Creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Explicit expiration timestamp used by MongoDB TTL index
  expiresAt: {
    type: Date,
    default: null
  }
});

// TTL Index for automatic expiration handling by MongoDB
clipSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Clip', clipSchema);
