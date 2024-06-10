import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/AuthForm/AuthForm'
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';



const App = () => {
  

  return (
      <Router>
        <Routes>
          <Route base path="/" element={<AuthForm />} /> 
          <Route path="/dashboard/:username" element={<Dashboard /> } />
          <Route path="/admin-dashboard/:username" element={<AdminDashboard />} /> 
          <Route path="/reset-password" element={<ResetPassword />} /> 
        </Routes>
      </Router>
   
  )
}


export default App
