import React, { useEffect, useState } from "react";
import './index.css';
import { ThemeProvider } from "./ThemeContext";


import WelcomePage from "./Components/WelcomePage";
import Menu from "./Components/Menu";
import Game from "./Components/Game";
import HowToPlayModal from "./Components/HowToPlayModal";
import Header from "./Components/Header";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";

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
  
import { 
  getAuth, 
  createUserWithEmailAndPassword ,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import DataWarning from "./Components/DataWarning";





const playerInfoTemplate = {
  gamesPlayed: 0,
  winPercentage: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessStats : {
    guessedInOne: 0,
    guessedInTwo: 0,
    guessedInThree: 0,
    guessedInFour: 0,
    guessedInFive: 0,
    guessedInSix: 0,
  },
  incomplete: 0,
  lastGamePlayed: null,
}


const dataTemplate = {
  username: null, 
  activeRow: null,
  guessRow: {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  },
  gameData: playerInfoTemplate,
}



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getStoredUserData())
  }, [])


  const auth = getAuth()

  function createUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('account successfully created!')
        setUser(user)
        addUserToDatabase(user)
        closeSignUp();
      })
      .catch((e) => {
        console.log(e.code, e.message)
        alert(`failed to create account: ${e.code} `)
      });
      
  }

  async function signInUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('successful log in')
        const user = userCredential.user;
        getUserFromDatabase(user)
        setUser(user);
      })
      .catch(e => {
        console.log(e.code, e.message)
        alert(`log in attempt failed: ${e.message}`)
      })
  }

  function signOutUser() {
    if (!user) return
    signOut(auth)
      .then(() => {
        setUser(null)
        alert('you have been signed out')
      })
      .catch((e) => {
        console.log(e.code, e.message)
        alert(e.code)
      })
  }

  function initLocalStorageData() {
    if (localStorage.getItem('turdle-data-key')) {
      console.log('local key stored')
      return
    } else {
      localStorage.setItem('turdle-data-key', JSON.stringify(dataTemplate))
      localStorage.setItem('turdle-theme', JSON.stringify(false))
    }
  }

  function getStoredUserData() {
    let data = JSON.parse(localStorage.getItem('turdle-data-key'))
    return data.user
  }


  function storeUserLocally(user) {
    // user passed in is a docSnap from firebase DB
    let localUser = user.playerInfo
    localStorage.setItem('turdle-data-key', JSON.stringify(localUser))
  }

  async function getUserFromDatabase(user) {
    const docRef = doc(getFirestore(), "users", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      console.log('initializing local storage . . .')
      storeUserLocally(docSnap.data())
    } else {
      console.log("No such document!");
      return false
    }
  }

  async function addUserToDatabase(user) {
    const usersRef = collection(getFirestore(), "users");
    await setDoc(doc(usersRef, user.email), {
      email: user.email, 
      timeCreated: user.metadata.creationTime,
      uid: user.uid,
      playerInfo: dataTemplate,
    });
  }
  
  async function updateUserData(user, data) {
    const docRef = doc(getFirestore(), "users", user.email)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDoc(docRef, {someData: data}, {merge: true})
      console.log("Document data:", docSnap.data());
    } else {
      console.log("Error: No such document!");
      return false
    }
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
    document.querySelector('#sign-up-email').value = '';
    document.querySelector('#sign-up-password').value = '';
    try {
      signUp.close();
    } catch (e) {console.log(e)} 
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

  function openSignIn() {
    const signIn = document.querySelector('.sign-in');
    document.querySelector('#email').value = '';
    document.querySelector('#password').value = '';
    try {
      signIn.close();
    } catch(e) {console.log(e)} 
    signIn.showModal();
    signIn.classList.add('show')
  }

  function closeSignIn() {
    const signIn = document.querySelector('.sign-in');
    signIn.classList.remove('show');
    setTimeout(() => {
      signIn.close();
    }, 500)
  }

  function openDataWarning() {
    const dataWarning = document.querySelector('.data-warning');
    try {
      dataWarning.close();
    } catch(e) {console.log(e)};
    dataWarning.showModal();
    dataWarning.classList.add('show');
  }

  function closeDataWarning() {
    const dataWarning = document.querySelector('.data-warning');
    dataWarning.classList.remove('show');
    setTimeout(() => {
      dataWarning.close();
    }, 500)
  }


  return (
    <ThemeProvider>
      <div 
        onLoad={() => {
          initLocalStorageData()
        }}
        className="app flex-grow flex flex-col justify-center items-center"
      >
        <Header 
          user={user}
          openMenu={openMenu}
        />



        <div>
          {/* {user ? <p>Hello {user.email}!</p> : null} */}
        </div>



        <Menu 
          signOutUser={signOutUser} 
          openHowTo={openHowTo}
          closeMenu={closeMenu}
        />
        <HowToPlayModal
          closeHowTo={closeHowTo}
        />
        <SignUp 
          closeSignUp={closeSignUp}
          createUser={createUser}
        />
        <SignIn 
          closeSignIn={closeSignIn}
          signInUser={signInUser}
        />
        <DataWarning 
          closeDataWarning={closeDataWarning}
          setUser={setUser}
        />

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
            openSignIn={openSignIn}
            openDataWarning={openDataWarning}
          />
        }
      </div>
    </ThemeProvider>
  );
};

export default App;



// Initialize Firebase
const app = initializeApp(firebaseConfig);