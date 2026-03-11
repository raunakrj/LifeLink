# LifeLink: AI-Powered Blood & Organ Donation Platform

## Quick Start Guide

To run the full application (Backend + Frontend + Databases), follow these steps in order:

### 1. Start the Databases
Open a terminal in the root directory (`Lifelink1.0`) and run:
```bash
docker-compose up -d
```
*Note: Ensure Docker Desktop is running.*

### 2. Setup Backend Environment
1. Navigate to the `backend` folder.
2. Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your keys (especially `ANTHROPIC_API_KEY`).

### 3. Run the Backend
In a new terminal, navigate to the `backend` folder and run:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Run the Frontend
In another terminal, navigate to the `frontend` folder and run:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## Project Structure
- **/backend**: Express server, AI services, and Mongoose models.
- **/frontend**: React + Tailwind CSS + Shadcn/ui.
- **docker-compose.yml**: MongoDB and Redis setup.
