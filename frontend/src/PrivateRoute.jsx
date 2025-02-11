import { Navigate } from 'react-router-dom';
import { useMyContext } from './utils/MyContext'; // Import the function
import { checkAndRemoveExpiredToken } from './components/checkAndRemoveExpiredToken';

export const ProtectedRoute = ({ children }) => {
  checkAndRemoveExpiredToken() // Check and remove expired token

  const { user } = useMyContext();
  const token = localStorage.getItem('token'); // Get token after possible removal

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }) => {
  checkAndRemoveExpiredToken(); 

  const { user } = useMyContext();
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const UserRoute = ({ children }) => {
  checkAndRemoveExpiredToken(); 

  const { user } = useMyContext();
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
