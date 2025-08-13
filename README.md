# Architecture Portfolio Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A modern backend API for managing architecture portfolios, built with <a href="http://nodejs.org" target="_blank">Node.js</a> and <a href="https://nestjs.com" target="_blank">NestJS</a>.</p>

## 🏗️ Project Overview

This backend service provides a comprehensive API for managing architecture portfolios with the following features:

- **Portfolio Management**: Create, read, update, and delete portfolio entries with multilingual support
- **Media Handling**: Support for images and videos with file upload capabilities
- **Authentication**: JWT-based authentication system
- **Multilingual Content**: Support for English and French content
- **Static File Serving**: Serve uploaded media files
- **Database**: MongoDB with Prisma ORM

## 🚀 Features

- **RESTful API**: Clean and intuitive API endpoints
- **JWT Authentication**: Secure user authentication and authorization
- **File Upload**: Handle image and video uploads with Multer
- **Multilingual Support**: JSON-based content management for multiple languages
- **Database Integration**: MongoDB with Prisma for type-safe database operations
- **Static File Serving**: Serve uploaded media files through dedicated endpoints

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="mongodb://localhost:27017/architecture-portfolio"
JWT_SECRET="your-jwt-secret-key"
PORT=3000
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (if using migrations)
npx prisma db push
```

## 🏃‍♂️ Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── portfolio/           # Portfolio management module
│   ├── interfaces/
│   ├── portfolio.controller.ts
│   └── portfolio.service.ts
├── app.controller.ts    # Main application controller
├── app.service.ts       # Main application service
├── app.module.ts        # Root module
├── main.ts             # Application entry point
└── logger.service.ts   # Logging service
```

## 🗄️ Database Schema

The application uses MongoDB with the following main models:

- **Portfolio**: Portfolio entries with multilingual content and media
- **ContactUs**: Contact information with multilingual support
- **AboutUs**: About us content with multilingual support

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Portfolio Management
- `GET /api/portfolios` - Get all portfolios
- `GET /api/portfolios/:id` - Get portfolio by ID
- `POST /api/portfolios` - Create new portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Media Files
- `GET /uploads/:filename` - Serve uploaded media files

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## 📦 Dependencies

### Core Dependencies
- **@nestjs/common**: NestJS core framework
- **@nestjs/jwt**: JWT authentication
- **@nestjs/passport**: Passport integration
- **@prisma/client**: Database ORM
- **bcryptjs**: Password hashing
- **multer**: File upload handling

### Development Dependencies
- **@nestjs/cli**: NestJS CLI tools
- **prisma**: Database schema management
- **typescript**: TypeScript support
- **jest**: Testing framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
