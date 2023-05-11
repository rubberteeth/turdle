import React, { useState } from "react";
import './index.css';
import { ThemeProvider } from "./ThemeContext";
import WelcomePage from "./Components/WelcomePage";
import Menu from "./Components/Menu";
import Game from "./Components/Game";


function App() {
  const [user, setUser] = useState(null);

  function openMenu() {
    const menu = document.querySelector('.menu')
    menu.classList.remove('hidden')
    menu.className = 'menu bg-gray-300 absolute right-0 h-full w-2/5 z-10 translate-x-0';
  }

  return (
    <ThemeProvider>
      <div 
        className="app min-h-screen bg-yellow-50 flex justify-center items-center"
      >
        <Menu setUser={setUser}/>
        {user
        ?
          <Game openMenu={openMenu}/>
        :
        <>
          <WelcomePage 
            setUser={setUser}
            openMenu={openMenu}
          />
        </>
         
        }
      </div>
    </ThemeProvider>
  );
};

export default App;
