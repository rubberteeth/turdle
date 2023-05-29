import React, { useContext, useEffect, useState } from "react";

const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();

export function useTheme() { 
  return useContext(ThemeContext)
};

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext)
}

export function ThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    function getDarkModeSettingFromStorage() {
      if (!localStorage.getItem('turdle-data-key')) return
      let data = JSON.parse(localStorage.getItem('turdle-data-key'))
      if (data.darkTheme !== darkTheme) {
        setDarkTheme(data.darkTheme)
        return
      }
    }
    getDarkModeSettingFromStorage()
  }, [darkTheme])

  function toggleTheme() {
    setDarkTheme(curr => !curr);
  };

  return ( 
    <ThemeContext.Provider value={darkTheme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  )
}