# StackIt 🚀

> A modern, full-stack Q&A platform built for developers and knowledge seekers

---

## 👥 Team Information
- **Team Leader**: ARPAN DAS
- **Team Name**: Team 3379
- **Email**: contact.codingarpan@gmail.com
- **Phone**: 7679812045
- **Total Members**: 1

---

## 📖 About StackIt

StackIt is a comprehensive Q&A platform inspired by Stack Overflow, designed to help developers and knowledge seekers ask questions, share answers, and build a community around learning. The platform features a modern, responsive UI with rich text editing capabilities and a robust voting system.

## ✨ Key Features

### 🔐 User Authentication
- **Secure Registration & Login**: JWT-based authentication system
- **User Profiles**: Personalized user profiles with account management
- **Session Management**: Persistent login sessions with secure token handling

### 📝 Question Management
- **Rich Text Questions**: Create questions with rich formatting using Quill.js editor
- **Tags System**: Organize questions with relevant tags
- **Question Viewing**: Browse and search through questions
- **View Counter**: Track question popularity with view counts

### 💬 Answer System
- **Rich Text Answers**: Submit answers with full rich text formatting
- **HTML Content Support**: Proper rendering of code blocks, headings, and formatted text
- **Answer Threading**: Multiple answers per question with proper organization

### 🗳️ Voting System
- **Upvote/Downvote**: Community-driven content quality control
- **Vote Restrictions**: One vote per user per answer
- **Real-time Updates**: Instant vote count updates
- **Authentication Required**: Login required for voting to prevent spam

### 🎨 Modern UI/UX
- **Dark Theme**: Beautiful dark theme optimized for readability
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators and error handling
- **Interactive Components**: Hover effects and smooth transitions

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for SPA navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Quill.js**: Rich text editor for content creation
- **Lucide React**: Modern icon library
- **Vite**: Fast build tool and development server

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for building REST APIs
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ODM for MongoDB with schema validation
- **JWT**: JSON Web Tokens for authentication
- **Zod**: Schema validation for API endpoints
- **bcryptjs**: Password hashing and security

### Development Tools
- **Docker**: Containerization for development environment
- **ESLint**: Code linting and quality assurance
- **Git**: Version control system


## 📁 Project Structure

```
StackIt/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/     # Auth & validation
│   │   └── db/              # Database connection
│   ├── index.js             # Server entry point
│   └── package.json         # Dependencies
├── userinterface/           # Frontend React app
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── common/      # Shared components
│   │   │   └── pages/       # Page components
│   │   ├── assets/          # Static assets
│   │   └── main.jsx         # App entry point
│   ├── public/              # Public assets
│   └── package.json         # Dependencies
├── docker-compose.yml       # Development environment
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Docker (optional, for containerized development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodingArpan/StackIt.git
   cd StackIt
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd userinterface
   npm install
   npm run dev
   ```

4. **Docker Setup (Alternative)**
   ```bash
   docker-compose up --build
   ```

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Question Endpoints
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Answer Endpoints
- `GET /api/answers/question/:id` - Get answers for question
- `POST /api/answers` - Create new answer
- `POST /api/answers/:id/vote` - Vote on answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer

## 🔧 Development Features

### Rich Text Editor
- **Quill.js Integration**: Full-featured rich text editing
- **Custom Toolbar**: Optimized toolbar for Q&A content
- **HTML Storage**: Content stored as HTML for rich rendering

### Responsive Design
- **Mobile-First**: Designed for mobile devices first
- **Breakpoint System**: Responsive across all screen sizes
- **Touch-Friendly**: Optimized for touch interactions

### Performance Optimizations
- **Code Splitting**: Lazy loading of components
- **API Caching**: Efficient data fetching strategies
- **Image Optimization**: Optimized asset delivery

## 🎯 Future Enhancements

### Planned Features
- [ ] **Search Functionality**: Advanced search with filters
- [ ] **User Reputation System**: Points and badges
- [ ] **Comment System**: Comments on questions and answers
- [ ] **Bookmark Feature**: Save questions for later
- [ ] **Email Notifications**: Answer notifications
- [ ] **Admin Dashboard**: Content moderation tools
- [ ] **API Rate Limiting**: Prevent abuse
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **File Uploads**: Image attachments
- [ ] **Social Login**: OAuth integration



## 📞 Contact

- **Developer**: ARPAN DAS
- **Email**: contact.codingarpan@gmail.com
- **GitHub**: [@CodingArpan](https://github.com/CodingArpan)


---

