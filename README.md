# LifeLink: AI-Powered Blood & Organ Donation Platform

## Quick Start Guide

To run the full application (Backend + Frontend + Databases), follow these steps in order:

### 1. Start the Databases
Open a terminal in the root directory (Lifelink1.0) and run:

docker-compose up -d

Note: Ensure Docker Desktop is running.

### 2. Setup Backend Environment
1. Navigate to the backend folder.
2. Create a .env file by copying .env.example
3. Fill in your keys (especially ANTHROPIC_API_KEY).

### 3. Run the Backend
In a new terminal:

npm run dev

Server will start at:
http://localhost:5000

### 4. Run the Frontend
In another terminal:

npm run dev

Application will run at:
http://localhost:5173

---

## Project Structure

/backend → Express server, AI services, Mongoose models  
/frontend → React + Tailwind CSS + Shadcn/ui  
/docker-compose.yml → MongoDB and Redis setup

---

## About LifeLink

LifeLink is an AI-powered platform that connects blood and organ donors with patients during emergencies.  
Users create profiles with blood group and location, enabling quick donor discovery.  

Built using:
- React
- Node.js / Express
- MongoDB Atlas
- AI chatbot assistance

The platform helps hospitals and individuals find nearby donors faster and improves emergency response.
