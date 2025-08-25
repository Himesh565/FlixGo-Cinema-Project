# Movie Ticket Booking System

A beautiful and modern movie ticket booking website built with React.js, Node.js, MongoDB, and Bootstrap.

## Features

- 🎬 **Movie Browsing**: Browse movies with filters by genre, language, and type
- 🎫 **Ticket Booking**: Interactive seat selection with real-time availability
- 👤 **User Authentication**: Secure registration and login system
- 💳 **Payment Integration**: Multiple payment methods support
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🔍 **Search & Filter**: Advanced search and filtering capabilities
- 📅 **Booking Management**: View and cancel bookings
- ⭐ **Rating System**: Movie ratings and reviews
- 🎭 **Theater Management**: Multiple theaters and screens support

## Tech Stack

### Frontend
- **React.js** - Modern UI library
- **Bootstrap 5** - Responsive CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Beautiful icons
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-ticket-booking
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-booking
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

5. **Start the development servers**
   ```bash
   # Start both server and client
   npm run dev
   
   # Or start them separately
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

## Project Structure

```
movie-ticket-booking/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theater.js
│   │   ├── Show.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── bookings.js
│   │   └── theaters.js
│   └── index.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Home.js
│   │   │   ├── Movies.js
│   │   │   ├── MovieDetail.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Booking.js
│   │   │   ├── MyBookings.js
│   │   │   └── Footer.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── MovieContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/:id` - Get theater by ID
- `GET /api/theaters/:id/shows` - Get shows by theater

## Features in Detail

### 1. User Authentication
- Secure registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes

### 2. Movie Management
- Browse movies with filters
- Search functionality
- Movie details with ratings
- Genre and language filtering

### 3. Seat Booking
- Interactive seat selection
- Real-time seat availability
- Multiple seat selection
- Visual seat layout

### 4. Payment System
- Multiple payment methods
- Secure payment processing
- Booking confirmation
- E-ticket generation

### 5. Booking Management
- View booking history
- Cancel bookings
- Booking status tracking
- Booking codes

## Screenshots

The application features a modern, responsive design with:
- Beautiful hero section with movie showcase
- Interactive seat selection interface
- Clean and intuitive navigation
- Mobile-friendly responsive design
- Professional booking management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Happy Movie Booking! 🎬🎫** 