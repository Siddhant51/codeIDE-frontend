import { createContext, useState, useEffect } from "react";

// Create the context
export const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(() => {
    // Get the saved theme from localStorage or default to light mode
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : false; // false means dark mode
  });

  // Toggle theme and save it to localStorage
  const toggleTheme = () => {
    setIsLightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isLightMode));
  }, [isLightMode]);

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
