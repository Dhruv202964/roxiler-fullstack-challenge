import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Active Admin Route */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Placeholder Dashboard Routes */}
          <Route path="/owner" element={<h2>Owner Dashboard (Coming Soon)</h2>} />
          <Route path="/user" element={<h2>Normal User Dashboard (Coming Soon)</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;