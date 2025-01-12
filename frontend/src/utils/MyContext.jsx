import React, { createContext, useState, useContext } from 'react';

// Create the context
const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info here

  const updateUser = (userData) => {
    setUser(userData); // Update user data
  };

  return (
    <MyContext.Provider value={{ user, updateUser }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context in any component
export const useMyContext = () => useContext(MyContext);
