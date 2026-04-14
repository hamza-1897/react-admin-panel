import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Providers from './pages/Providers';
import Reports from './pages/Reports';
import EmailUser from './pages/EmailUser';
import Settings from './pages/Settings';
import AdminLayout from './components/layout/AdminLayout';
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Admin Layout Routes */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="providers" element={<Providers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="email" element={<EmailUser />} />
          <Route path="settings" element={<Settings />} />
          {/* Add more nested routes here in the future like this: */}
          {/* <Route path="users" element={<UsersPage />} /> */}
          {/* Catch-all for dashboard routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Redirect any totally unknown route to home (Login) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
