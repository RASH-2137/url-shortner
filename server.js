require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/urlShortener'

// ============ MIDDLEWARE ============
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ============ MONGODB CONNECTION ============
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✓ MongoDB connected successfully'))
  .catch(err => {
    console.error('✗ MongoDB connection failed:', err.message)
    process.exit(1)
  })

// ============ UTILITY FUNCTIONS ============
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`
}

// ============ ROUTES ============

// GET - Display all short URLs
app.get('/', async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find().sort({ createdAt: -1 })
    const baseUrl = getBaseUrl(req)
    res.render('index', { shortUrls: shortUrls, baseUrl: baseUrl })
  } catch (err) {
    console.error('Error fetching URLs:', err)
    res.status(500).render('index', { shortUrls: [], baseUrl: getBaseUrl(req), error: 'Failed to load URLs' })
  }
})

// POST - Create new short URL
app.post('/shortUrls', async (req, res) => {
  try {
    const { fullUrl } = req.body

    // Validation
    if (!fullUrl || typeof fullUrl !== 'string') {
      return res.status(400).json({ error: 'URL is required' })
    }

    if (!isValidUrl(fullUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    // Check for duplicates
    const existing = await ShortUrl.findOne({ full: fullUrl })
    if (existing) {
      return res.status(400).json({ error: 'This URL is already shortened', short: existing.short })
    }

    // Create short URL
    const shortUrl = await ShortUrl.create({ full: fullUrl })
    console.log(`✓ Created short URL: ${shortUrl.short} -> ${fullUrl}`)

    res.status(201).json({
      success: true,
      full: shortUrl.full,
      short: shortUrl.short,
      shortUrl: `${getBaseUrl(req)}/${shortUrl.short}`
    })
  } catch (err) {
    console.error('Error creating short URL:', err)
    res.status(500).json({ error: 'Failed to create short URL' })
  }
})

// GET - Redirect to full URL
app.get('/:shortUrl', async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) {
      return res.status(404).render('404', { shortUrl: req.params.shortUrl })
    }

    // Increment clicks
    shortUrl.clicks++
    await shortUrl.save()
    console.log(`✓ Redirect: ${req.params.shortUrl} (Total clicks: ${shortUrl.clicks})`)

    res.redirect(shortUrl.full)
  } catch (err) {
    console.error('Error processing redirect:', err)
    res.status(500).send('Internal server error')
  }
})

// DELETE - Remove a short URL
app.delete('/shortUrls/:id', async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findByIdAndDelete(req.params.id)
    if (!shortUrl) {
      return res.status(404).json({ error: 'Short URL not found' })
    }
    console.log(`✓ Deleted short URL: ${shortUrl.short}`)
    res.status(200).json({ success: true, message: 'Short URL deleted' })
  } catch (err) {
    console.error('Error deleting short URL:', err)
    res.status(500).json({ error: 'Failed to delete short URL' })
  }
})

// GET - Statistics for a short URL
app.get('/api/stats/:shortUrl', async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (!shortUrl) {
      return res.status(404).json({ error: 'Short URL not found' })
    }
    res.json({
      short: shortUrl.short,
      full: shortUrl.full,
      clicks: shortUrl.clicks,
      createdAt: shortUrl.createdAt
    })
  } catch (err) {
    console.error('Error fetching stats:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// ============ ERROR HANDLING ============
app.use((req, res) => {
  res.status(404).render('404', { shortUrl: req.originalUrl })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ============ SERVER START ============
app.listen(PORT, () => {
  console.log(`\n🚀 URL Shortener server running on http://localhost:${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}\n`)
})