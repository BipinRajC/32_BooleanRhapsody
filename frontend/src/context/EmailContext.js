// src/context/EmailContext.js
import React, { createContext, useContext, useState } from "react";

const EmailContext = createContext();

export const useEmailContext = () => {
  return useContext(EmailContext);
};

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState("");

  const updateEmail = (newEmail) => {
    setEmail(newEmail);
  };

  return (
    <EmailContext.Provider value={{ email, updateEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
