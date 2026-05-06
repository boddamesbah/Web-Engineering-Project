import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container">
      <div className="home-section">
        <h2>Welcome to Course Management System</h2>
        <p>
          Manage courses, instructors, students, and enrollments efficiently.
          This is a comprehensive system built with React and ASP.NET Core.
        </p>
        <p>
          <strong>Features:</strong>
        </p>
        <ul style={{ textAlign: 'left', display: 'inline-block', marginBottom: '2rem' }}>
          <li>Manage courses and course information</li>
          <li>Track student enrollments</li>
          <li>View instructor profiles</li>
          <li>Update course details and grades</li>
          <li>Secure authentication with JWT</li>
          <li>Real-time data synchronization</li>
        </ul>
        <div>
          <Link to="/courses" className="btn btn-primary">View Courses</Link>
          <Link to="/enrollments" className="btn btn-primary">View Enrollments</Link>
        </div>
      </div>
    </div>
  )
}
