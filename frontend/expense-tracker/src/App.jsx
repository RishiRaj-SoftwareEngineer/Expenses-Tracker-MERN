import React, { useEffect, useState } from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import Home from './pages/Dashboard/Home.jsx';
import Expense from './pages/Dashboard/Expense.jsx';
import Income from './pages/Dashboard/Income.jsx';
import UserProvider from './context/userContext.jsx';


const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Safely check localStorage only on client side
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  //Redirect to home if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />  
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path='/' element={<Root />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/home' element={<Home />} />
            <Route path='/dashboard' element={<Home />} />
            <Route path='/expense' element={<Expense />} />
            <Route path='/income' element={<Income />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App;
