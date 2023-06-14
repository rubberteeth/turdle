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
import DataWarning from "./Components/GuestDataWarning";
import Statistics from "./Components/Statistics";

import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from 'firebase/app'

import { 
  collection, 
  getFirestore, 
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
  
import { 
  getAuth, 
  createUserWithEmailAndPassword ,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";




const playerInfoTemplate = {
  gamesPlayed: 0,
  winPercentage: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessedIn : {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
  },
  incomplete: 0,
  lastGamePlayed: null,
  lastGameCompleted: null,
}

const guessesTemplate = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
}

const dataTemplate = {
  username: null, 
  activeRow: 0,
  guesses: guessesTemplate,
  playerStatistics: playerInfoTemplate,
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let user;
    if (getStorage('turdle-data-key')) {
      user = getStorage('turdle-data-key').username
    }
    if (user !== null) setUser(user)
    setTimeout(() => {setIsLoading(false)}, 600);
  }, [])


// ----- User functions 

  const auth = getAuth()

  function createUser(email, password) {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('account successfully created!')
        setUser(email)
        setUsername(email)
        addUserToDatabase(user)
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
      })
      .catch((e) => {
        console.log(e.code, e.message)
        alert(`failed to create account: ${e.code} `)
      });
    
  }

  async function signInUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('successful log in')
        setUser(email)
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
        setUsername(null)
        resetGameData();
      })
      .catch((e) => {
        console.log(e.code, e.message)
        alert(e.code)
      })
  }



//  ----- Local storage and data functions



  async function addUserToDatabase(user) {
    const usersRef = collection(getFirestore(), "users");
    dataTemplate.username = user.email
    await setDoc(doc(usersRef, user.email), {
      username: user.email, 
      timeCreated: user.metadata.creationTime,
      info: dataTemplate,
      uid: user.uid
    });
  } 

  function getStorage(key) {
    return JSON.parse(localStorage.getItem(key))
  }

  function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function setUsername(username) {
    let storage = getStorage('turdle-data-key');
    storage.username = username;
    setLocalStorage('turdle-data-key', storage);
  }

  function initLocalStorageData() {
    if (localStorage.getItem('turdle-data-key')) {
      return
    } else {
      setLocalStorage('turdle-data-key', dataTemplate)
      localStorage.setItem('turdle-theme', JSON.stringify(false));
      console.log('local storage initialized');
    }
  }
  
  async function getDailyWordFromDB() {
    const word = doc(getFirestore(), 'words', 'dailyWord');
    const wordSnap = await getDoc(word);
    return await wordSnap.data().word
  }

  async function storeDailyWordLocally(word) {
    if (word) {
      localStorage.setItem('turdle-daily-word', JSON.stringify(word)) 
      return
    } 
    localStorage.setItem('turdle-daily-word', JSON.stringify(await getDailyWordFromDB()));
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

  function openStatistics() {
    const statistics = document.querySelector('.statistics');
    try{
      statistics.close();
    } catch(e) {console.log(e)};
    statistics.showModal();
    statistics.classList.add('show');
  }

  function closeStatistics() {
    const statistics = document.querySelector('.statistics');
    statistics.classList.remove('show');
    setTimeout(() => {
      statistics.close();
    }, 500);
  }

  function updateStatisticsData() {
    const playerStatistics = getStorage('turdle-data-key').playerStatistics;
    const gamesPlayedElement = document.querySelector('.games-played');
    const winPercentElement = document.querySelector('.win-percentage');
    const currentStreakElement = document.querySelector('.current-streak');
    const maxStreakElement = document.querySelector('.max-streak');
    const guessedInOneDiv = document.querySelector('div.gi-1');
    const guessedInTwoDiv = document.querySelector('div.gi-2');
    const guessedInThreeDiv = document.querySelector('div.gi-3');
    const guessedInFourDiv = document.querySelector('div.gi-4');
    const guessedInFiveDiv = document.querySelector('div.gi-5');
    const guessedInSixDiv = document.querySelector('div.gi-6');
    const guessedInOneP = document.querySelector('p.gi-1');
    const guessedInTwoP = document.querySelector('p.gi-2');
    const guessedInThreeP = document.querySelector('p.gi-3');
    const guessedInFourP = document.querySelector('p.gi-4');
    const guessedInFiveP = document.querySelector('p.gi-5');
    const guessedInSixP = document.querySelector('p.gi-6');

    gamesPlayedElement.textContent = playerStatistics.gamesPlayed;
    winPercentElement.textContent = playerStatistics.winPercentage;
    currentStreakElement.textContent = playerStatistics.currentStreak;
    maxStreakElement.textContent = playerStatistics.maxStreak;

    function determineWidth(value) {
      if (value === 0 || playerStatistics.gamesPlayed === 0) return 50;
      return Math.floor(((value / playerStatistics.gamesPlayed) * 100) * 2.5) + 50;
    }

    guessedInOneP.textContent = playerStatistics.guessedIn.one;
    guessedInTwoP.textContent = playerStatistics.guessedIn.two;
    guessedInThreeP.textContent = playerStatistics.guessedIn.three;
    guessedInFourP.textContent = playerStatistics.guessedIn.four;
    guessedInFiveP.textContent = playerStatistics.guessedIn.five;
    guessedInSixP.textContent = playerStatistics.guessedIn.six;

    guessedInOneDiv.style.width = `${determineWidth(playerStatistics.guessedIn.one)}px`;
    guessedInTwoDiv.style.width = `${determineWidth(playerStatistics.guessedIn.two)}px`;
    guessedInThreeDiv.style.width = `${determineWidth(playerStatistics.guessedIn.three)}px`;
    guessedInFourDiv.style.width = `${determineWidth(playerStatistics.guessedIn.four)}px`;
    guessedInFiveDiv.style.width = `${determineWidth(playerStatistics.guessedIn.five)}px`;
    guessedInSixDiv.style.width = `${determineWidth(playerStatistics.guessedIn.six)}px`;

  }



  
// ------ GAME FUNCTIONS
 
  // return boolean comparing if today's date matches daily word's date on DB
  async function isNewDay() {
    let today = new Date().toString().split(' ').slice(1, 4).join(' ');
    const dailyWordRef = doc(getFirestore(), 'words', 'dailyWord');
    const dailyWordSnap = await getDoc(dailyWordRef);
    const storedDate = dailyWordSnap.data().day;
    return storedDate !== today;
  }


  async function setWord() {
    // if day hasn't changed, return from function
    if (await isNewDay() !== true) return 
    resetGameData()

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

    // create/update 'daily word' document using randomWord variable
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

    storeDailyWordLocally(randomWord)
  }

  async function resetGameData() {
    let storage = getStorage('turdle-data-key');
    storage.guesses = guessesTemplate;
    storage.activeRow = 0;
    setLocalStorage('turdle-data-key', storage)
  };


  return (
    <ThemeProvider>
      { isLoading 
      ? <h1 className="flex items-center m-auto">Loading</h1>
      : <div 
        onLoad={() => {
          initLocalStorageData()
          setWord()
          storeDailyWordLocally()
        }}
        className="app flex-grow flex flex-col justify-center items-center"
      >
        <Header 
          user={user}
          openMenu={openMenu}
        />

        <Menu 
          user={user}
          signOutUser={signOutUser} 
          openHowTo={openHowTo}
          closeMenu={closeMenu}
          openStatistics={openStatistics}
          updateStatisticsData={updateStatisticsData}
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
          resetGameData={resetGameData}
          closeDataWarning={closeDataWarning}
          setUser={setUser}
        />
        <Statistics 
          closeStatistics={closeStatistics}
          getStorage={getStorage}
        />
        

        {user
        ? 
          <Game 
            guessesTemplate={guessesTemplate}
            isLoading={isLoading}
            user={user}
            closeMenu={closeMenu}
            openStatistics={openStatistics}
            updateStatisticsData={updateStatisticsData}
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
      </div>}
    </ThemeProvider>
  );
};

export default App;



// Initialize Firebase
const app = initializeApp(firebaseConfig);