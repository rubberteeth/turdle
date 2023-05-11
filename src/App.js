import React, { useState } from "react";
import './index.css';
import WelcomePage from "./Components/WelcomePage";
import { ThemeProvider } from "./ThemeContext";


function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider>
      <div className="app min-h-screen bg-yellow-50 flex justify-center items-center">
        {user
        ?
          null
        :
         <WelcomePage 
          setUser={setUser}
        />
        }
      </div>
    </ThemeProvider>
  );
};

export default App;
