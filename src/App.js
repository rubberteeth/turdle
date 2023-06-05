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




import { finalWordList } from "./Assets/Data/finalWords";



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
  activeRow: 0,
  dailyWord: null,
  guesses: {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  },
  playerStatistics: playerInfoTemplate,
}



function App() {
  const [user, setUser] = useState(null);


// ----- User functions 


  const auth = getAuth()

  function createUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('account successfully created!')
        setUser(email)
        addUserToDatabase(user)
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
        // const user = userCredential.user;
        getUserFromDatabase(email)
        setUser(email);
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


  async function addUserToDatabase(user) {
    const usersRef = collection(getFirestore(), "users");
    await setDoc(doc(usersRef, user.email), {
      email: user.email, 
      timeCreated: user.metadata.creationTime,
      playerInfo: dataTemplate,
      uid: user.uid
    });
  }

  async function getUserFromDatabase(email) {
    const docRef = doc(getFirestore(), "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      storeUserDataLocally(docSnap.data())
    } else {
      console.log("No such document!");
      return false
    }
  }




//  ----- Local storage and data functions

  



  function initLocalStorageData() {
    if (localStorage.getItem('turdle-data-key')) {
      return
    } else {
      localStorage.setItem('turdle-data-key', JSON.stringify(dataTemplate));
      localStorage.setItem('turdle-theme', JSON.stringify(false));
      console.log('local storage initialized');
    }
  }

  function setLocalStorage(data) {
    localStorage.setItem('turdle-data-key', JSON.stringify(data));
  }

  

  async function storeDailyWordLocally() {
    let storage = JSON.parse(localStorage.getItem('turdle-data-key'));

    async function getDailyWordFromDB() {
      const word = doc(getFirestore(), 'words', 'dailyWord');
      const wordSnap = await getDoc(word);
      return await wordSnap.data().word
    }
    storage.dailyWord = await getDailyWordFromDB();
    setLocalStorage(storage)
  }

  function storeUserDataLocally(userData) {
    // user passed in is a docSnap from firebase DB
    let localUser = userData.playerInfo
    console.log('storing user data locally. . . ')
    localStorage.setItem('turdle-data-key', JSON.stringify(localUser))
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







// ------ GAME FUNCTIONS


// return boolean comparing if today's date matches daily word's date on DB
async function isNewDay() {
  let today = new Date().toString().split(' ').slice(1, 4).join(' ');
  const dailyWordRef = doc(getFirestore(), 'words', 'dailyWord');
  const dialyWordSnap = await getDoc(dailyWordRef);
  const storedDate = dialyWordSnap.data().day;
  if (storedDate === today) return false
  return true
}


async function setWord() {
  // if day hasn't changed, return from function
  if (await isNewDay() !== true) return 
  // reference to entire words list document;
  const fullWordsListRef = doc(getFirestore(), 'words', 'fullWordsList')
  const fullWordsListSnap = await getDoc(fullWordsListRef);

  // use length of valid words list to choose a random word
  let wordsListLength = fullWordsListSnap.data().validWordsList.length

  // ste random word to a variable
  let randomWord = fullWordsListSnap.data().validWordsList[Math.floor(Math.random() * wordsListLength)]

  // reference to 'words' collection on db
  const wordsRef = collection(getFirestore(), 'words');

  // reference to used words document on db
  const usedWordsRef = doc(getFirestore(), 'words', 'usedWordsList');
  // snapshot of used words data
  const usedWordsSnap = await getDoc(usedWordsRef);
  // copy of used words array from db 
  const usedWords = usedWordsSnap.data().usedWords

  // if word in used words list, pick a new word, debated on removing words from words list altogether 
  // but decided to use a separate array to keep track of used words.
  while (usedWords.indexOf(randomWord) !== -1) {
    randomWord = fullWordsListSnap.data().validWordsList[Math.floor(Math.random() * wordsListLength)]
  }

  // create/update random word document using randomWord variable
  await setDoc(doc(wordsRef, 'dailyWord'), {
    // split new date into day/month/year,  example : 'Jan 01 2023'
    day: new Date().toString().split(' ').slice(1, 4).join(' '),
    // choose random word to set to DB
    word: randomWord
  })
  
  // create/update used words list on DB so words don't get used twice
  await setDoc(doc(wordsRef, 'usedWordsList'), {
    usedWords: [...usedWords, randomWord]
  })
}


//  --- temp functions 



  async function addWordsListToDatabase(list) {
    const wordsRef = collection(getFirestore(), 'words');
    await setDoc(doc(wordsRef, 'fullWordsList'), {
      validWordsList: list
    })
  }













  return (
    <ThemeProvider>
      <div 
        onLoad={() => {
          setWord()
          initLocalStorageData()
          storeDailyWordLocally()
        }}
        className="app flex-grow flex flex-col justify-center items-center"
      >
        <Header 
          user={user}
          openMenu={openMenu}
        />

        <button
          onClick={() => {
            // storeDailyWordLocally()
          }}
        ></button>

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