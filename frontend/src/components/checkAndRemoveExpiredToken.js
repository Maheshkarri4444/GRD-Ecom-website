import {jwtDecode} from 'jwt-decode'; // Install with: npm install jwt-decode

export const checkAndRemoveExpiredToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
        // console.log("checking token")
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {  // Convert exp to milliseconds
        // console.log("Token expired. Removing...");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
    //   console.error("Invalid token. Removing...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};


