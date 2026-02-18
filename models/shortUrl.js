const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: [true, 'Full URL is required'],
    validate: {
      validator: function(v) {
        try {
          new URL(v)
          return true
        } catch (e) {
          return false
        }
      },
      message: 'Invalid URL format'
    }
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate,
    unique: true,
    lowercase: true,
    trim: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Clicks cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt timestamp before saving
shortUrlSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Ensure unique index on short
shortUrlSchema.index({ short: 1 }, { unique: true })

module.exports = mongoose.model('ShortUrl', shortUrlSchema)