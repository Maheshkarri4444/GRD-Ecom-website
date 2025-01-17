import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user data from localStorage on initialization
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (userData) => {
    setUser(userData); // Update user data
    localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
  };

  useEffect(() => {
    // Sync context state with localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Runs only on component mount

  return (
    <MyContext.Provider value={{ user, updateUser }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context in any component
export const useMyContext = () => useContext(MyContext);
