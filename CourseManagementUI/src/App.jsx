import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute, { AdminRoute, InstructorRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CoursesList from './pages/CoursesList'
import CourseForm from './pages/CourseForm'
import CourseDetail from './pages/CourseDetail'
import StudentsList from './pages/StudentsList'
import StudentForm from './pages/StudentForm'
import StudentDetail from './pages/StudentDetail'
import InstructorsList from './pages/InstructorsList'
import InstructorForm from './pages/InstructorForm'
import InstructorDetail from './pages/InstructorDetail'
import EnrollmentsList from './pages/EnrollmentsList'
import EnrollmentForm from './pages/EnrollmentForm'
import EnrollmentDetail from './pages/EnrollmentDetail'

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Courses Routes */}
        <Route path="/courses" element={<ProtectedRoute><CoursesList /></ProtectedRoute>} />
        <Route path="/courses/new" element={<InstructorRoute><CourseForm /></InstructorRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/courses/:id/edit" element={<InstructorRoute><CourseForm /></InstructorRoute>} />

        {/* Students Routes */}
        <Route path="/students" element={<ProtectedRoute><StudentsList /></ProtectedRoute>} />
        <Route path="/students/new" element={<AdminRoute><StudentForm /></AdminRoute>} />
        <Route path="/students/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
        <Route path="/students/:id/edit" element={<AdminRoute><StudentForm /></AdminRoute>} />

        {/* Instructors Routes */}
        <Route path="/instructors" element={<ProtectedRoute><InstructorsList /></ProtectedRoute>} />
        <Route path="/instructors/new" element={<AdminRoute><InstructorForm /></AdminRoute>} />
        <Route path="/instructors/:id" element={<ProtectedRoute><InstructorDetail /></ProtectedRoute>} />
        <Route path="/instructors/:id/edit" element={<AdminRoute><InstructorForm /></AdminRoute>} />

        {/* Enrollments Routes */}
        <Route path="/enrollments" element={<ProtectedRoute><EnrollmentsList /></ProtectedRoute>} />
        <Route path="/enrollments/new" element={<ProtectedRoute><EnrollmentForm /></ProtectedRoute>} />
        <Route path="/enrollments/:id" element={<ProtectedRoute><EnrollmentDetail /></ProtectedRoute>} />
        <Route path="/enrollments/:id/edit" element={<ProtectedRoute><EnrollmentForm /></ProtectedRoute>} />

        {/* Catch all - 404 */}
        <Route path="*" element={
          <div className="container">
            <div className="no-data">
              <h2>404 - Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}
