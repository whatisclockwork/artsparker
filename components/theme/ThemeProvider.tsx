import React, { createContext, useContext } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
});

export const useTheme = () => useContext(ThemeContext);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ isDarkMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};