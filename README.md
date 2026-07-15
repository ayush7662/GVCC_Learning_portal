# Learning Portal - MERN Stack Application

A clean, beginner-to-intermediate level learning portal built with the MERN stack (MongoDB, Express, React, Node.js). This application allows students to watch videos, create bookmarks, track progress, and includes screenshot protection features.

## Features

### Authentication
- User registration with email and password
- User login with JWT authentication
- Password hashing with bcrypt
- Protected routes for authenticated users
- Logout functionality

### Video Learning
- Dashboard displaying all available videos
- Video cards with thumbnails, titles, and descriptions
- Search functionality to filter videos
- HTML5 video player with full controls
- Play, pause, seek, volume, and fullscreen support
- Current time and duration display

### Bookmarks
- Create multiple bookmarks per video
- Custom bookmark names (optional)
- Automatic timestamp capture
- Display all bookmarks below the player
- Seek to bookmark timestamp instantly
- Delete bookmarks

### Progress Tracking
- Auto-save playback position every 10 seconds
- Resume from saved timestamp when reopening video
- Visual progress bar showing percentage watched
- Recently watched videos section on dashboard

### Screenshot Protection
- Disabled right-click context menu
- Disabled text selection
- Disabled video dragging
- Transparent watermark with user's email
- Print Screen key detection with warning toast
- Tab blur detection with video blur effect

**Note:** These protections are practical deterrents but cannot completely prevent screenshots due to browser limitations. Users can still use external tools or mobile devices to capture content.

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Clean and modern UI with Tailwind CSS
- Professional layout with navbar and video cards

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB with Mongoose

### Authentication
- JWT (JSON Web Tokens)
- bcrypt for password hashing

## Project Structure

```
GVCC_learning_portal/
├── client/
│   ├── public/
│   │   ├── videos/          # Place video files here
│   │   └── thumbnails/      # Place thumbnail images here
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── bookmarkService.js
│   │   │   ├── progressService.js
│   │   │   └── videoService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Bookmark.js
│   │   ├── Progress.js
│   │   ├── User.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookmarks.js
│   │   ├── progress.js
│   │   └── videos.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
└── README.md
```

## Installation Steps

### Prerequisites
- Node.js 
- MongoDB 

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

5. Seed the database with sample videos:
```bash
node seed.js
```

6. Start the server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user
- **Body:** `{ email, password, name }`
- **Response:** `{ token, user: { id, email, name } }`

#### POST /api/auth/login
Login an existing user
- **Body:** `{ email, password }`
- **Response:** `{ token, user: { id, email, name } }`

### Videos

#### GET /api/videos
Get all videos
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of video objects

### Bookmarks

#### POST /api/bookmarks
Create a new bookmark
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, timestamp, videoId }`
- **Response:** Bookmark object

#### GET /api/bookmarks/:videoId
Get all bookmarks for a video
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of bookmark objects

#### PUT /api/bookmarks/:id
Update a bookmark
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, timestamp }`
- **Response:** Updated bookmark object

#### DELETE /api/bookmarks/:id
Delete a bookmark
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ message: 'Bookmark deleted successfully' }`

### Progress

#### POST /api/progress
Save or update video progress
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ videoId, timestamp }`
- **Response:** Progress object

#### GET /api/progress/:videoId
Get progress for a specific video
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Progress object or `{ timestamp: 0 }`

#### GET /api/progress/recent/all
Get recently watched videos
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of progress objects with video details



To use your own videos:
1. Place MP4 files in `client/public/videos/`
2. Place thumbnail images in `client/public/thumbnails/`
3. Update the video URLs and thumbnail paths in `server/seed.js`
4. Run `node seed.js` to update the database

## Future Improvements

Potential enhancements for the project:

- **Admin Panel**: Add an admin interface to manage videos, users, and content
- **Video Upload**: Allow admins to upload videos directly through the UI
- **Categories/Tags**: Organize videos by categories or tags
- **User Profiles**: Allow users to customize their profiles
- **Comments/Reviews**: Add commenting system for videos
- **Video Quality**: Support multiple video quality options
- **Offline Support**: Add PWA capabilities for offline viewing
- **Analytics**: Track user engagement and video completion rates
- **Email Notifications**: Send reminders for incomplete courses
- **Certificates**: Generate completion certificates for users
- **Advanced Screenshot Protection**: Implement DRM or watermarking at server level

## Running the Application

1. Start MongoDB (if not already running)
2. In one terminal, start the backend:
```bash
cd server
npm run dev
```

3. In another terminal, start the frontend:
```bash
cd client
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

5. Register a new account or login with existing credentials


## License

This project is created for educational purposes.

## Author

Ayush Raj
