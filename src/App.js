import React, { useState } from "react";
import './index.css';
import { ThemeProvider } from "./ThemeContext";
import WelcomePage from "./Components/WelcomePage";
import Menu from "./Components/Menu";
import Game from "./Components/Game";
import HowToPlayModal from "./Components/HowToPlayModal";
import Header from "./Components/Header";


function App() {
  const [user, setUser] = useState(null);


  function openMenu() {
    const menu = document.querySelector('.menu')
    menu.classList.remove('hidden')
    menu.className = 'menu bg-gray-300 absolute right-0 top-0 h-screen w-2/5 z-20 translate-x-0';
  }

  function closeMenu() {
    const menu = document.querySelector('.menu')
    menu.className = 'menu bg-gray-300 absolute right-0 top-0 w-2/5 h-screen z-20 translate-x-full';
  }

  function openHowTo() {
    const dialog = document.querySelector('.page-1');
    const pageTwo = document.querySelector('.page-2');
    try {
      dialog.close();
      pageTwo.close();
    } catch(e) {
      console.log(e)
    }

    dialog.showModal();
    dialog.classList.add('show');
  };



  return (
    <ThemeProvider>
      <div 
        className="app h-full flex flex-col justify-center items-center"
      >
        <Header 
          user={user}
          openMenu={openMenu}
        />
        <Menu 
          setUser={setUser} 
          openHowTo={openHowTo}
          closeMenu={closeMenu}
        />
        <HowToPlayModal />
        {user
        ?
          <Game 
            closeMenu={closeMenu}
          />
        :
          <WelcomePage 
            setUser={setUser}
            openHowTo={openHowTo}
            closeMenu={closeMenu}
          />
        }
      </div>
    </ThemeProvider>
  );
};

export default App;
