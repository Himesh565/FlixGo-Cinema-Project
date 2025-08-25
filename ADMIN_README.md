# Movie Booking System - Admin Panel

## Overview
This admin panel provides comprehensive management capabilities for the movie booking system, including movies, theaters, shows, bookings, users, and analytics.

## Features

### 1. Admin Dashboard (`/admin`)
- Overview of all system components
- Quick navigation to different admin sections
- Statistics cards showing key metrics

### 2. Movies Management (`/admin/movies`)
- Add new movies with details (title, description, duration, genre, etc.)
- Edit existing movie information
- Delete movies
- View all movies in a table format

### 3. Theaters Management (`/admin/theaters`)
- Add new theaters with location and contact details
- Edit theater information
- Delete theaters
- Manage theater capacity and screens

### 4. Shows Management (`/admin/shows`)
- Schedule movie shows with specific theaters and screens
- Set show times, dates, and pricing
- Edit and delete shows
- Link movies to theaters for specific time slots

### 5. Bookings Overview (`/admin/bookings`)
- View all bookings in the system
- Filter bookings by status (pending, confirmed, cancelled)
- Update booking status
- Delete bookings
- View booking statistics

### 6. Users Management (`/admin/users`)
- View all registered users
- Add new users
- Edit user information
- Promote/demote users to admin status
- Delete users

### 7. Analytics (`/admin/analytics`)
- View booking statistics
- Revenue analysis
- Top performing movies
- Monthly revenue charts
- Booking status distribution

## Setup Instructions

### 1. Create Admin User
Run the following command to create an admin user:
```bash
node server/createAdmin.js
```

This will create an admin user with:
- Email: admin@example.com
- Password: admin123

### 2. Start the Application
```bash
# Start the server
cd server
npm start

# Start the client (in a new terminal)
cd client
npm start
```

### 3. Access Admin Panel
1. Login with the admin credentials
2. You'll see an "Admin" dropdown in the navigation bar
3. Click on "Admin" to access the admin dashboard
4. Navigate to different sections using the dashboard cards

## Admin Panel Navigation

### Dashboard Cards
- **Movies Management**: Manage all movies in the system
- **Theaters Management**: Manage theaters and their details
- **Shows Management**: Schedule and manage movie shows
- **Bookings Overview**: View and manage all bookings
- **Users Management**: Manage user accounts
- **Analytics**: View system statistics and reports

### Common Actions
- **Add New**: Click the "Add New" button to create new entries
- **Edit**: Click the "Edit" button to modify existing entries
- **Delete**: Click the "Delete" button to remove entries
- **Status Updates**: For bookings, you can confirm or cancel them

## Security Features

### Authentication
- All admin routes require authentication
- Only users with `isAdmin: true` can access admin features
- JWT tokens are used for authentication

### Authorization
- Admin middleware ensures only admin users can access admin routes
- Regular users cannot access admin functionality

## API Endpoints

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/admin` - Toggle admin status
- `GET /api/admin/analytics` - Get analytics data

### Protected Routes
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)
- `POST /api/theaters` - Create theater (admin only)
- `PUT /api/theaters/:id` - Update theater (admin only)
- `DELETE /api/theaters/:id` - Delete theater (admin only)
- `POST /api/shows` - Create show (admin only)
- `PUT /api/shows/:id` - Update show (admin only)
- `DELETE /api/shows/:id` - Delete show (admin only)

## Troubleshooting

### Common Issues

1. **Cannot access admin panel**
   - Ensure you're logged in with an admin account
   - Check if the user has `isAdmin: true` in the database

2. **API errors**
   - Check if the server is running
   - Verify authentication tokens are being sent
   - Check browser console for error messages

3. **Data not loading**
   - Check if MongoDB is running
   - Verify database connection
   - Check server logs for errors

### Error Messages
- "Access denied. Admin privileges required." - User is not an admin
- "Token is not valid" - Authentication token is invalid or expired
- "User not found" - The requested user doesn't exist

## Database Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Movie Model
```javascript
{
  title: String,
  description: String,
  duration: Number,
  genre: String,
  releaseDate: Date,
  posterUrl: String,
  trailerUrl: String,
  rating: Number
}
```

### Theater Model
```javascript
{
  name: String,
  location: String,
  address: String,
  phone: String,
  email: String,
  screens: Number,
  capacity: Number
}
```

### Show Model
```javascript
{
  movieId: ObjectId,
  theaterId: ObjectId,
  screenNumber: Number,
  date: Date,
  time: String,
  price: Number,
  totalSeats: Number,
  availableSeats: Number,
  bookedSeats: [String]
}
```

### Booking Model
```javascript
{
  user: ObjectId,
  show: ObjectId,
  seats: [String],
  totalAmount: Number,
  status: String,
  paymentMethod: String,
  createdAt: Date
}
```

## Future Enhancements

1. **Advanced Analytics**
   - Real-time booking statistics
   - Revenue forecasting
   - User behavior analysis

2. **Bulk Operations**
   - Bulk import movies
   - Bulk schedule shows
   - Bulk user management

3. **Advanced Filtering**
   - Date range filters
   - Advanced search functionality
   - Export capabilities

4. **Notification System**
   - Email notifications for bookings
   - Admin alerts for system events
   - User communication tools 