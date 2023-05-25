import React, { useState } from "react";
import './index.css';
import { ThemeProvider } from "./ThemeContext";


import WelcomePage from "./Components/WelcomePage";
import Menu from "./Components/Menu";
import Game from "./Components/Game";
import HowToPlayModal from "./Components/HowToPlayModal";
import Header from "./Components/Header";


import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from 'firebase/app'

import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getFirestore, 
  doc,
  getDoc,
  updateDoc,
  setDoc,
  } from 'firebase/firestore'
  
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import SignUp from "./Components/SignUp";


async function addUserToDatabase(user) {
  const usersRef = collection(getFirestore(), "users");
  await setDoc(doc(usersRef, `${user}`), {
    user: `${user}`, 
    city: "whitby", 
    country: "canada",
    timeCreated: serverTimestamp()
  });
}


async function getUserFromDatabase(user) {
  const docRef = doc(getFirestore(), "users", `${user}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
  // get date/time from server timestamp
  console.log(new Date(parseInt(docSnap.data().timeCreated.seconds.toString() + '000')))
  console.log(window.navigator)
}


function createUser(email, password) {
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
    })
    .catch((error) => {
      console.log(error.code, error.message)
    });
}

function localStorageGuestDataKey(userID) {
  if (localStorage.getItem('turdle-data-key')) {
    console.log(localStorage.getItem('turdle-data-key'))
  } else {
    localStorage.setItem('turdle-data-key', JSON.stringify(`${userID}`))
  }
}


function App() {
  const [user, setUser] = useState(null);
  const [dataKey, setDataKey] = useState('');




  function getKeyFromStorage() {
    setDataKey(() => JSON.parse(localStorage.getItem('turdle-data-key')));
  }
  




  // Menu and Dialog box functions;

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

  function closeHowTo() {
    const pageTwo = document.querySelector('.page-2');
    pageTwo.classList.remove('show');
    setTimeout(() => {
      pageTwo.close();
    }, 500);
  };

  function openSignUp() {
    const signUp = document.querySelector('.sign-up');
    try {
      signUp.close();
    } catch (e) {
      console.log(e);
    } 
    signUp.showModal();
    signUp.classList.add('show');
  }

  function closeSignUp() {
    const signUp = document.querySelector('.sign-up');
    signUp.classList.remove('show');
    setTimeout(() => {
      signUp.close()
    }, 500);
  }



  return (
    <ThemeProvider>
      <div 
        className="app flex-grow flex flex-col justify-center items-center"
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
        <HowToPlayModal
          closeHowTo={closeHowTo}
        />
        <SignUp 
          closeSignUp={closeSignUp}
        />


        <button className="p-4 border-2 w-full"
        onClick={() => {createUser('mike.melchior@outlook.com', '123456')}}>TEST ADD USER</button>


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
            openSignUp={openSignUp}
          />
        }
      </div>
    </ThemeProvider>
  );
};

export default App;



// Initialize Firebase
const app = initializeApp(firebaseConfig);