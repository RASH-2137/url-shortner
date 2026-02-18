# URL Shortener

A fast, simple, and elegant URL shortening service built with Node.js, Express, and MongoDB.

## Features

✨ **Key Features:**
- 🔗 Create short, shareable links from long URLs
- 📊 Track click statistics for each shortened URL
- 🗑️ Delete shortened URLs when no longer needed
- 📋 Copy short links to clipboard with one click
- ✅ URL validation before shortening
- 🔄 Duplicate URL detection (reuses existing short codes)
- 📱 Fully responsive design
- 🚀 Production-ready error handling

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** EJS, Bootstrap 4, Font Awesome
- **Environment Management:** dotenv

## Prerequisites

Before running the application, make sure you have:
- Node.js (v12 or higher)
- npm or yarn
- MongoDB (running locally or via cloud connection)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd url-shortener
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update if needed:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/urlShortener
   ```

## Usage

### Development Mode

Run the application with hot reload using nodemon:

```bash
npm run devStart
```

The application will start at `http://localhost:5000`

### Production Mode

```bash
node server.js
```

## API Endpoints

### Create Short URL
- **Endpoint:** `POST /shortUrls`
- **Method:** POST
- **Body:**
  ```json
  {
    "fullUrl": "https://example.com/long/url"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "full": "https://example.com/long/url",
    "short": "short123",
    "shortUrl": "http://localhost:5000/short123"
  }
  ```

### Redirect to Full URL
- **Endpoint:** `GET /:shortUrl`
- **Description:** Redirects to the full URL and increments click counter

### Get Statistics
- **Endpoint:** `GET /api/stats/:shortUrl`
- **Description:** Returns statistics for a short URL
- **Response:**
  ```json
  {
    "short": "short123",
    "full": "https://example.com/long/url",
    "clicks": 5,
    "createdAt": "2026-02-19T10:30:00Z"
  }
  ```

### Delete Short URL
- **Endpoint:** `DELETE /shortUrls/:id`
- **Description:** Deletes a shortened URL by ID

### Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Returns API status

## Project Structure

```
url-shortener/
├── models/
│   └── shortUrl.js        # Mongoose schema and model
├── views/
│   ├── index.ejs          # Main UI
│   └── 404.ejs            # Error page
├── server.js              # Express server setup
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (local)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore patterns
└── README.md             # This file
```

## Database Schema

**ShortUrl Collection:**
```javascript
{
  full: String,           // Original URL (required, unique validation)
  short: String,          // Short code (required, unique)
  clicks: Number,         // Click count (default: 0)
  createdAt: Date,        // Creation timestamp (default: now)
  updatedAt: Date         // Last update timestamp (default: now)
}
```

## Error Handling

The application includes comprehensive error handling:
- ✅ URL validation
- ✅ MongoDB connection error handling
- ✅ Duplicate URL detection
- ✅ 404 error page for invalid short URLs
- ✅ JSON error responses for API errors
- ✅ Try-catch blocks in all route handlers

## Features in Detail

### URL Validation
- URLs are validated using the built-in URL constructor
- Invalid URLs are rejected with a clear error message
- Only URLs with proper format (http/https) are accepted

### Duplicate Detection
- If a URL is already shortened, the existing short code is returned
- Prevents duplicate entries in the database

### Click Tracking
- Every redirect increments the click counter
- Historical click data is preserved
- Statistics endpoint provides view counts

### Delete Functionality
- Users can delete short URLs they no longer need
- Removes all associated data from the database

## Logging

The application logs important events:
- MongoDB connection status
- Short URL creation
- Redirects with click counts
- Errors and exceptions

Example log output:
```
✓ MongoDB connected successfully
✓ Created short URL: abc123 -> https://example.com
✓ Redirect: abc123 (Total clicks: 1)
🚀 URL Shortener server running on http://localhost:5000
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/urlShortener` |

## Security Considerations

- URL validation prevents injection attacks
- MongoDB connection uses secure options
- Error messages don't expose sensitive information
- CORS headers can be easily added if needed

## Performance

- Sorted queries (recent URLs first)
- Indexed database fields for faster lookups
- Minimal payload responses
- Efficient client-side operations

## Contributing

Feel free to submit issues and enhancement requests!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

ISC

## Support

For issues and questions:
1. Check the README documentation
2. Review error messages in console and browser dev tools
3. Ensure MongoDB is running and connected
4. Verify .env configuration matches your setup

---

**Happy URL Shortening!** 🎉
