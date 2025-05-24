# PneuScope - Early Detection of Bronchopneumonia

PneuScope is a comprehensive IoT solution for early detection of bronchopneumonia in toddlers through real-time audio analysis. The system consists of a web application with role-based access for doctors and parents, real-time audio capture, and ML-powered risk assessment.

## 🏗️ Architecture

The application follows a microservices architecture with three main components:

- **Frontend**: Next.js 14+ with App Router, TypeScript, and Tailwind CSS
- **Backend**: Node.js + Express.js with Socket.io for real-time communication
- **ML Service**: FastAPI Python service for audio analysis and risk prediction

## 🚀 Features

### For Doctors
- Patient registration and management
- Real-time audio capture during examinations
- Live audio data visualization
- Risk assessment with ML analysis
- Patient history and trend analysis
- Comprehensive dashboard

### For Parents
- View child's assessment history
- Risk score explanations
- Historical trend visualization
- Read-only access to medical records

### Technical Features
- Real-time audio streaming with Socket.io
- JWT-based authentication with role management
- Responsive design with Tailwind CSS
- Interactive charts with Recharts
- RESTful API with Swagger documentation
- MongoDB for data persistence
- Docker containerization

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)
- Docker (optional)

## 🛠️ Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/pneuscope.git
cd pneuscope
\`\`\`

### 2. Frontend Setup

\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
\`\`\`

The frontend will be available at http://localhost:3000

### 3. Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other configurations
npm run dev
\`\`\`

The backend will be available at http://localhost:4000

### 4. ML Service Setup

\`\`\`bash
cd ml-service
pip install -r requirements.txt
python app.py
\`\`\`

The ML service will be available at http://localhost:5000

## 🔧 Environment Variables

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
\`\`\`

### Backend (.env)
\`\`\`
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pneuscope
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
ML_SERVICE_URL=http://localhost:5000
\`\`\`

## 🎯 Demo Credentials

The application comes with pre-seeded demo accounts:

- **Doctor**: doctor@example.com / password123
- **Parent**: parent@example.com / password123
- **Admin**: admin@pneuscope.com / password123

## 📖 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:4000/api-docs
- ML Service Docs: http://localhost:5000/docs

## 🐳 Docker Deployment

### Using Docker Compose

\`\`\`bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
\`\`\`

### Individual Services

\`\`\`bash
# Backend
cd backend
docker build -t pneuscope-backend .
docker run -p 4000:4000 pneuscope-backend

# ML Service
cd ml-service
docker build -t pneuscope-ml .
docker run -p 5000:5000 pneuscope-ml
\`\`\`

## 🌐 Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Configure build and start commands
4. Deploy

### ML Service (Railway/Render)
1. Connect GitHub repository
2. Set Python runtime
3. Configure requirements.txt
4. Deploy

## 🧪 Testing

\`\`\`bash
#
2. Set Python runtime
3. Configure requirements.txt
4. Deploy

## 🧪 Testing

\`\`\`bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
\`\`\`

## 📊 Usage Flow

### Doctor Workflow
1. Login with doctor credentials
2. Add new patients or select existing ones
3. Start audio capture during examination
4. View real-time audio visualization
5. Stop capture to generate risk assessment
6. Review patient history and trends

### Parent Workflow
1. Login with parent credentials
2. View children's assessment history
3. Review risk scores and explanations
4. Monitor health trends over time

## 🔍 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Check if backend is running on port 4000
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check CORS configuration in backend

**Socket.io connection issues:**
- Ensure NEXT_PUBLIC_SOCKET_URL is correct
- Check firewall settings
- Verify backend Socket.io setup

**ML service not responding:**
- Check if Python service is running on port 5000
- Verify ML_SERVICE_URL in backend .env
- Check Python dependencies installation

**Database connection errors:**
- Verify MongoDB is running
- Check MONGODB_URI format
- Ensure database permissions

## 🛡️ Security Considerations

- JWT tokens are stored in HTTP-only cookies
- Password hashing with bcrypt
- Input validation on all endpoints
- CORS configuration for production
- Environment variables for sensitive data
- Rate limiting (recommended for production)

## 🔮 Future Enhancements

- [ ] Real hardware sensor integration
- [ ] Advanced ML models (CNN, RNN)
- [ ] Email notifications for high-risk assessments
- [ ] Mobile app development
- [ ] Telemedicine integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with hospital systems

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This is a prototype application for demonstration purposes only. It should not be used for actual medical diagnosis or treatment. Always consult with qualified healthcare professionals for medical advice.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@pneuscope.com
- Documentation: https://docs.pneuscope.com

---

**Built with ❤️ for early childhood healthcare**
\`\`\`

Now let's create the final configuration files:
