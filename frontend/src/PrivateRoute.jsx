import { Navigate } from 'react-router-dom';
import { useMyContext } from './utils/MyContext';

// Route that requires authentication
export const ProtectedRoute = ({ children }) => {
  const { user } = useMyContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Route only accessible to admin users
export const AdminRoute = ({ children }) => {
  const { user } = useMyContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Route only accessible to regular users
export const UserRoute = ({ children }) => {
  const { user } = useMyContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};