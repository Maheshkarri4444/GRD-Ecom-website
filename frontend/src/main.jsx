// import { StrictMode, useEffect, useState } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.jsx';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Login from './components/User/Login.jsx';
// import { MyProvider, useMyContext } from './utils/MyContext.jsx';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useMyContext();  // Get the user from context
//   const isLoggedIn = user || localStorage.getItem('token');
  
//   // If the user is logged in, redirect to home
//   if (isLoggedIn) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// createRoot(document.getElementById('root')).render(
//   <MyProvider>
//     <StrictMode>
//       <Router>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={
//             <ProtectedRoute>
//               <Login />
//             </ProtectedRoute>
//           } />
//           <Route path="/" element={<App />} />
//         </Routes>
//       </Router>
//     </StrictMode>
//   </MyProvider>
// );


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/User/Login.jsx';
import { MyProvider } from './utils/MyContext.jsx';
import Profile from './components/User/Profile.jsx';
import AdminLayout from './components/Admin/AdminLayout.jsx';
createRoot(document.getElementById('root')).render(
  <MyProvider>
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path='/admin' element={<AdminLayout/>}/>

      </Routes>
    </Router>
  </StrictMode>
  </MyProvider>,
)