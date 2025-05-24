# PneuScope - Early Detection of Broncopneumonia in Toddlers

A full-stack biomedical IoT application for real-time chest audio analysis and risk assessment.

## 🏗️ Architecture

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io + MongoDB
- **ML Service**: FastAPI + Python
- **Real-time**: WebSocket communication for live audio data
- **Database**: MongoDB Atlas with Mongoose ODM

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account (or local MongoDB)

### Installation
\`\`\`bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp ml-service/.env.example ml-service/.env
\`\`\`

### Development
\`\`\`bash
# Run all services concurrently
npm run dev

# Or run individually:
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
npm run dev:ml        # http://localhost:8000
\`\`\`

### Default Credentials
- **Admin**: admin@pneuscope.com / admin123
- **Doctor**: doctor@pneuscope.com / doctor123

## 📱 Features

- **Patient Management**: Register and manage toddler patients
- **Real-time Audio Capture**: Simulated chest audio sensor data
- **ML Risk Assessment**: Automated broncopneumonia risk scoring
- **Live Dashboard**: Real-time charts and risk visualization
- **Role-based Access**: Admin, Doctor, and Guest roles
- **Responsive Design**: Mobile and desktop optimized

## 🔧 Deployment

### Frontend (Vercel)
\`\`\`bash
cd frontend
vercel --prod
\`\`\`

### Backend & ML (Render/Fly.io)
\`\`\`bash
# Backend
cd backend
docker build -t pneuscope-backend .
# Deploy to your preferred platform

# ML Service
cd ml-service
docker build -t pneuscope-ml .
# Deploy to your preferred platform
\`\`\`

## 🧪 Demo Flow

1. Navigate to http://localhost:3000
2. Login with doctor credentials
3. Register a new patient
4. Start audio capture simulation
5. View real-time decibel charts
6. Stop capture to get ML risk assessment
7. Review risk gauge and recommendations

## ⚠️ Prototype Notes

This is a proof-of-concept with simulated data:
- Audio data is randomly generated
- ML model uses simple rule-based logic
- Replace with real hardware integration for production
\`\`\`

Now let's create the frontend application:
