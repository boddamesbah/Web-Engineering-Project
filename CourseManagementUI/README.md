# Course Management System - Frontend

A modern React-based frontend application for managing courses, instructors, students, and enrollments. Built with React 18, React Router, and Axios for seamless integration with the ASP.NET Core backend API.

## 🎯 Features

- **Course Management**: View, create, edit, and delete courses
- **Enrollment Management**: Manage student enrollments and grades
- **Responsive Design**: Mobile-friendly interface with clean UI
- **Real-time Data**: Fetch and display data from backend API
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during data operations
- **Navigation**: Intuitive routing between pages

## 📁 Project Structure

```
CourseManagementUI/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx       # Main navigation bar
│   │   └── Navigation.css       # Navigation styles
│   ├── pages/
│   │   ├── Home.jsx              # Home page
│   │   ├── CoursesList.jsx        # Display all courses
│   │   ├── CourseForm.jsx         # Create/Edit course form
│   │   ├── CourseDetail.jsx       # View course details
│   │   ├── EnrollmentsList.jsx    # Display all enrollments
│   │   ├── EnrollmentForm.jsx     # Create/Edit enrollment form
│   │   └── EnrollmentDetail.jsx   # View enrollment details
│   ├── services/
│   │   ├── api.js               # Axios API configuration
│   │   ├── courseService.js     # Course API calls
│   │   ├── enrollmentService.js # Enrollment API calls
│   │   └── authService.js       # Authentication API calls
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── public/                      # Static files
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running on `https://localhost:7029`

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd CourseManagementUI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔗 API Integration

The frontend communicates with the backend ASP.NET Core API using Axios. All API calls are configured in the `src/services/` directory.

### API Base URL
```
https://localhost:7029/api
```

### API Endpoints Used

#### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get specific course
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

#### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `GET /api/enrollments/{id}` - Get specific enrollment
- `POST /api/enrollments` - Create new enrollment
- `PUT /api/enrollments/{id}` - Update enrollment
- `DELETE /api/enrollments/{id}` - Delete enrollment

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

## 📝 Pages and Features

### 1. **Home Page** (`/`)
- Welcome message
- Feature overview
- Quick links to courses and enrollments

### 2. **Courses List** (`/courses`)
- Display all available courses in a grid layout
- View course details (name, description, credits, instructor)
- Delete courses
- Link to create new course
- Loading and error states

### 3. **Create/Edit Course** (`/courses/new` and `/courses/:id/edit`)
- Form with controlled components
- Fields: Name, Description, Credits, Instructor ID
- Form validation
- Success/error notifications
- Auto-redirect on successful submission

### 4. **Course Details** (`/courses/:id`)
- View complete course information
- Edit or delete course
- Navigation back to courses list

### 5. **Enrollments List** (`/enrollments`)
- Display all enrollments in table format
- Show student ID, course ID, enrollment date, grade
- Delete enrollments
- Link to create new enrollment

### 6. **Create/Edit Enrollment** (`/enrollments/new` and `/enrollments/:id/edit`)
- Form to manage enrollments
- Fields: Student ID, Course ID, Grade
- Validation and error handling
- Success messages

### 7. **Enrollment Details** (`/enrollments/:id`)
- View complete enrollment information
- Edit or delete enrollment
- Navigation back to enrollments list

## 🎨 UI Components

### Styling
- **Global CSS**: `src/index.css` contains all styling
- **Responsive Design**: Mobile-first approach with grid layouts
- **Color Scheme**: Professional blue and gray theme

### Key Style Classes
- `.btn` - Button styling
- `.form-group` - Form elements
- `.table` - Table styling
- `.card` - Card components
- `.container` - Content wrapper
- `.loading` - Loading state
- `.error-message` / `.success-message` - Message styling

## 🔐 Authentication

JWT tokens are stored in localStorage and automatically included in API requests. The application handles:
- Token storage and retrieval
- Automatic token injection in request headers
- 401 response handling (redirects to login)

## 🚨 Error Handling

The application includes:
- Try-catch error handling in all API calls
- User-friendly error messages
- Loading states during data operations
- Validation error feedback
- Network error handling

## 📚 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2"
}
```

### Dev Dependencies
- `vite`: Fast build tool
- `@vitejs/plugin-react`: React support for Vite
- `@types/react`: TypeScript definitions

## 🌐 Environment Configuration

The API proxy is configured in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:7029',
      changeOrigin: true,
      secure: false
    }
  }
}
```

For production, update the API URL in `src/services/api.js`.

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-optimized layouts
- Touch-friendly buttons
- Responsive grid system
- Adaptive typography

## 🎓 College Project Requirements Met

✅ React project with clear structure  
✅ React Router with 7+ routes  
✅ Backend API connection with Axios  
✅ React state management  
✅ 7+ pages (Home, Courses List, Course Form, Course Detail, Enrollments List, Enrollment Form, Enrollment Detail)  
✅ Controlled component forms with validation  
✅ Navigation between pages  
✅ Error handling and loading states  
✅ Responsive design  

## 🔧 Development Tips

1. **Hot Reload**: Changes are automatically reflected in the browser
2. **DevTools**: Use React DevTools browser extension for debugging
3. **Console**: Check browser console for API errors
4. **API Testing**: Use Postman/Thunder Client to test backend endpoints

## 📝 Future Enhancements

- Add user authentication UI (login/register pages)
- Implement instructor and student pages
- Add search and filter functionality
- Export data to CSV/PDF
- Add notifications/toast messages
- Implement pagination for large datasets
- Add dark mode theme
- Add unit and integration tests

## 🤝 Submission

This project fulfills all requirements for the Web Engineering course:

- ✅ GitHub repository (ready for push)
- ✅ README with setup instructions
- ✅ API routes documented
- ✅ Application structure clearly organized
- ✅ Ready for presentation in lab

## 📞 Support

For issues or questions about the frontend setup, check:
- Console errors in browser DevTools
- Network tab to see API calls
- React DevTools for state debugging

---

**Built with ❤️ for Web Engineering Course**
