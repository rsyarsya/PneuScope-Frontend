# PneuScope

PneuScope is a prototype web application for early detection of bronchopneumonia in toddlers. It captures chest audio from a sensor (simulated), preprocesses it, runs a basic ML inference, and displays a real-time risk score dashboard.

## Project Structure

The project consists of three main components:

1. **Frontend**: Next.js application with React and TypeScript
2. **Backend**: Node.js + Express.js server with TypeScript
3. **ML Service**: FastAPI Python service for audio analysis

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.9 or later)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/pneuscope.git
cd pneuscope
\`\`\`

2. Set up environment variables:

   - Create `.env` files in both `frontend` and `backend` directories based on the provided `.env.example` files.

3. Install dependencies and start the development servers:

#### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The frontend will be available at http://localhost:3000

#### Backend

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

The backend will be available at http://localhost:4000

#### ML Service

\`\`\`bash
cd ml-service
pip install -r requirements.txt
python app.py
\`\`\`

The ML service will be available at http://localhost:5000

## Demo Script

1. Start all three services as described above
2. Open http://localhost:3000 in your browser
3. Login using the demo credentials:
   - Admin: admin@pneuscope.com / password123
   - Doctor: doctor@pneuscope.com / password123
4. Navigate to the dashboard
5. Select a patient or create a new one
6. Click "Start Capture" to begin simulating audio data collection
7. After a few seconds, click "Stop Capture" to analyze the data
8. View the risk assessment result

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Set the following environment variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend
   - `NEXT_PUBLIC_ML_SERVICE_URL`: URL of your deployed ML service
   - `NEXT_PUBLIC_SOCKET_URL`: URL of your deployed backend (for Socket.IO)

### Backend (Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to `npm install && npm run build`
4. Set the start command to `npm start`
5. Add the environment variables from `.env.example`

### ML Service (Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to `pip install -r requirements.txt`
4. Set the start command to `uvicorn app:app --host 0.0.0.0 --port $PORT`

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Patient Management**: CRUD operations for patient records
- **Live Audio Capture**: Real-time audio data visualization using Socket.IO
- **ML Inference**: Risk assessment based on audio data
- **Dashboard**: Interactive dashboard with charts and gauges

## License

This project is licensed under the MIT License - see the LICENSE file for details.
