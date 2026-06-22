
# AI Travel Planner

## Overview

AI Travel Planner is a full-stack MERN application that helps users create personalized travel plans using Google Gemini AI. Users can register, log in, generate AI-powered travel itineraries, manage trips, and customize their travel activities.


## Features 

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* Create AI-generated travel itineraries
* View all created trips
* Edit trip details
* Delete trips
* Regenerate itinerary for a specific day using AI
* Add custom activities to any day
* Remove custom activities
* Estimated travel budget
* Recommended hotels
* AI-generated packing list

---

## Tech Stack 

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js

### AI Integration

* Google Gemini API
The application includes fallback itinerary generation when the Gemini API is unavailable or rate-limited.
---

## Project Structure 

```
AI-Travel-Planner/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

---

## Installation and Setup 

### Clone the repository

```bash
git clone https://github.com/your-username/AI-Travel-Planner.git
```

---

## Backend Setup

Navigate to backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start backend server:

```bash
npm start
```

---

## Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints 

### Authentication Routes

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login user          |

### Trip Routes

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| POST   | /api/trips                     | Create a new trip       |
| GET    | /api/trips                     | Get all user trips      |
| PUT    | /api/trips/:id                 | Update trip             |
| DELETE | /api/trips/:id                 | Delete trip             |
| PUT    | /api/trips/:id/regenerate-day  | Regenerate specific day |
| PUT    | /api/trips/:id/add-activity    | Add custom activity     |
| PUT    | /api/trips/:id/remove-activity | Remove custom activity  |

---

## Authentication 🔐

* JWT tokens are used for authentication.
* Protected routes can only be accessed by authenticated users.
* Tokens are stored in browser localStorage.

---

## Key Functionalities 📋

### User Authentication

Users can securely register and log into the application.

### AI Trip Generation

Users provide destination, trip duration, budget type, and interests. Google Gemini AI generates a personalized travel itinerary.

### Trip Management

Users can:

* View trips
* Edit trips
* Delete trips

### Itinerary Customization

Users can regenerate specific days and add/remove their own activities.

---

## Future Enhancements 

* Weather Forecast Integration
* Google Maps Integration
* Flight Recommendations
* Export itinerary as PDF
* Share trip with other users

---

## Screenshots

Add screenshots of:

* Login Page
* Dashboard
* Create Trip Page
* Trip Details Page

---

## Deployment 

### Frontend

Deploy using:

* Vercel
* Netlify

### Backend

Deploy using:

* Render
* Railway

### Database

MongoDB Atlas

---

## Author 

**Aditi Singh**

BCA Graduate | MERN Stack Developer

---

## Acknowledgements

* Google Gemini AI
* MongoDB Atlas
* React Documentation
* Express Documentation

---

## License

This project is developed for learning and portfolio purposes.
