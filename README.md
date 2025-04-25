# Event Platform

A full-stack event management platform built with React, Node.js, Express, and MongoDB. Users can create, discover, and manage events in various categories.

## Live Demo
- Frontend: [https://event-platform-frontend.vercel.app](https://event-platform-frontend.vercel.app)
- Backend: [https://event-platform-backend.vercel.app](https://event-platform-backend.vercel.app)

## Features

- 👥 User authentication (register, login, profile management)
- 📅 Create and manage events
- 🔍 Browse events by category
- 💾 Save favorite events
- 📱 Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React with Vite
- Material-UI for styling
- Zustand for state management
- Axios for API calls
- React Router for navigation

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
Replace:
- `your_mongodb_connection_string` with your MongoDB connection URL (local or Atlas)
- `your_jwt_secret_key` with a secure random string for JWT token signing

4. Install frontend dependencies:
```bash
cd ../event-platform
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The server will start on http://localhost:5000

2. In a new terminal, start the frontend development server:
```bash
cd event-platform
npm run dev
```
The frontend will be available at http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile (protected)

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get single event
- POST `/api/events` - Create new event (protected)
- PUT `/api/events/:id` - Update event (protected)
- DELETE `/api/events/:id` - Delete event (protected)

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Project Structure

```
event-platform/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── event-platform/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   └── utils/
    ├── public/
    └── index.html
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Material-UI for the beautiful components
- Zustand for simple state management
- MongoDB for the database
- Express for the backend framework

## Deployment

### Frontend Deployment (Vercel)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure the following settings:
   - Framework Preset: Vite
   - Root Directory: event-platform
   - Build Command: `npm run build`
   - Output Directory: dist
   - Install Command: `npm install`

### Backend Deployment (Vercel)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure the following settings:
   - Framework Preset: Node.js
   - Root Directory: backend
   - Build Command: `npm install`
   - Output Directory: .
   - Install Command: `npm install`
5. Add Environment Variables:
   - MONGODB_URI
   - JWT_SECRET
   - PORT

### Environment Variables Setup
Create a `.env` file in the backend directory with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
``` 