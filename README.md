## Job Application Tracker

A full-stack job application tracker built to replace the usual "spreadsheet of job applications" with something purpose-built — track every application's status, see interview and offer rates at a glance, and search/filter through your pipeline as it grows.

<img width="958" height="502" alt="Screenshot 2026-09-24 133559" src="https://github.com/user-attachments/assets/e1160428-a3a5-4e77-85b9-4fb1a6afe01d" />

<img width="959" height="503" alt="Screenshot 2026-09-24 133612" src="https://github.com/user-attachments/assets/49c2a5ce-3afe-44f4-9a82-d5c90e1e8471" />

<img width="959" height="503" alt="image" src="https://github.com/user-attachments/assets/6a9439a0-bbf6-475b-9a26-bdd4a693a079" />


Features
Full CRUD — add, view, edit, and delete job applications
Detail view — click into any application to see the full record (location, salary, job URL, notes, and more)
Search & filter — search by company name, filter by status and job type simultaneously
Dashboard analytics — total applications, interview rate, and offer rate, calculated live from your data
Charts (Recharts) — status distribution (pie), applications by month (bar), application source breakdown (bar)
Status tracking — Saved → Applied → Assessment → Interviewing → Offer / Rejected, color-coded throughout

## Tech stack

### Frontend

React + Vite
React Router
Tailwind CSS
Recharts (data visualization)

### Backend

Node.js + Express
Mongoose (MongoDB ODM)

### Database

MongoDB Atlas
Project structure
job-tracker/
├── frontend/
│   └── src/
│       ├── pages/          # Dashboard, Applications, AddApplication, ApplicationDetail
│       ├── components/     # Navbar, StatusBadge, etc.
│       └── layouts/        # MainLayout (navbar + outlet)
└── backend/
    ├── routes/             # applications.js
    ├── controllers/        # applicationController.js
    ├── models/             # Application.js (Mongoose schema)
    ├── config/             # db.js (MongoDB connection)
    └── server.js

## API endpoints
Method	Endpoint	Description
POST	/api/applications	Create a new application
GET	/api/applications	Get all applications
GET	/api/applications/:id	Get a single application
PUT	/api/applications/:id	Update an application
DELETE	/api/applications/:id	Delete an application

## Running locally
1. Clone the repo
bash
git clone https://github.com/AayushGurung22/Job-Tracker-App.git
cd Job-Tracker-App
2. Backend setup
bash
cd backend
npm install
cp .env.example .env

Fill in .env with your own MongoDB Atlas connection string:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_here

Then start the server:

bash
node server.js

You should see Server running on port 5000 and MongoDB connected.

3. Frontend setup

In a separate terminal:

bash
cd frontend
npm install
npm run dev

The app runs at http://localhost:5173 by default.

What I'd build next
Authentication — multi-user support with JWT, so each user only sees their own applications
Deployment — backend on Render/Railway, frontend on Vercel, so this is a live link rather than a local demo
Reminders — follow-up date notifications for applications sitting too long without a response
What I learned

Building this was my first time connecting a full stack end to end — React on the frontend, Express/Mongoose on the backend, MongoDB Atlas as the database. Along the way I worked through CORS configuration, schema validation with Mongoose enums, derived state with useMemo for the dashboard's live stats, and building a client-side search/filter pipeline over fetched data.

## Built by 
### Aayush Gurung
## Linkedin: https://www.linkedin.in/aayushgurung22
