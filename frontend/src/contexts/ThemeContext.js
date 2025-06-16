// src/contexts/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    localStorage.getItem('theme') === 'light' ? false : true
  );

  useEffect(() => {
    document.body.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
