import React, { useEffect, useState } from 'react';
import ThemeContext from './ThemeContext';

// Light/dark mode, backed by Bootstrap 5.3's built-in `data-bs-theme`
// attribute - every Bootstrap component (cards, navbars, forms, buttons...)
// already knows how to restyle itself for dark mode, so this just needs to
// flip that one attribute and remember the choice.
const getStoredTheme = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (err) {
    return 'light';
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
