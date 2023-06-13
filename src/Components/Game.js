import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'
import { collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";  


import Keyboard from './Keyboard'

function getStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}


export default function Game( { closeMenu, user, updateStatisticsData, openStatistics } ) {

  const [currentGuess, setCurrentGuess] = useState([]);
  const [activeRow, setActiveRow] = useState(0);



  const darkTheme = useTheme();

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#fefefe' : '#111',
  };

  
  useEffect(() => {

    function updateGuess() {
      // fill in corresponding row with current guess each time guess changes
      let guessRow = document.querySelectorAll(`.guess-row-${activeRow}>div`);
      for (let i = 0; i < 5; i++) {
        guessRow[i].textContent = currentGuess[i];
      }
    }  
    // check game is still being played
    if (activeRow < 6 && !gameCompleted()) updateGuess();
  },[currentGuess, activeRow]);

  useEffect(() => {
    async function getActiveRow() {
      if (user === 'guest') return;
      const docRef = doc(getFirestore(), "users", user);
      const docSnap = await getDoc(docRef);
      setActiveRow(await docSnap.data().info.activeRow);
    }
    getActiveRow();
  }, [user]);

  


  async function fillStoredGuesses() {
    let guesses;
    if (user === 'guest') guesses = getStorage('turdle-data-key').guesses;
    else {
      const docRef = doc(getFirestore(), "users", user);
      const docSnap = await getDoc(docRef);
      guesses = docSnap.data().info.guesses;
    };

    // if no stored guesses, return
    if (guesses[0] === null) return;
    for (let row in guesses) {
      // if all stored guesses filled in, return
      if (guesses[row] === null) return ;
      let index = 0;
      let guess = guesses[row];
      let currentGuessRow = document.querySelectorAll(`.guess-row-${row}>div`)
      currentGuessRow.forEach(square => {
        square.textContent = guess[index];
        index++;
      });
      animateRowsAndPaintKeys(row);
    };
  };


  function handleBackspace() {
    if (!currentGuess.length) return;
    setCurrentGuess(prev => [...prev.slice(0, prev.length - 1)]);
  };

  function handleLetterInput(letter) {
    if (currentGuess.length === 5) return;
    setCurrentGuess(prev => [...prev, letter]);
  }; 

  function lowerCaseGuess() {
    return currentGuess.join('').toLowerCase();
  };

  async function guessIsInWordList() {
    const wordsRef = doc(getFirestore(), 'words', 'fullWordsList');
    const wordsSnap = await getDoc(wordsRef);
    if (wordsSnap.exists()) {
        // return boolean of wether word is in valid words list
      return wordsSnap.data().validWordsList.indexOf(lowerCaseGuess()) !== -1
    }
  };

  function shakeRow() {
    let guessRow = document.querySelector(`.guess-row-${activeRow}`);
    guessRow.classList.add('shake');
    setTimeout(() => {
      guessRow.classList.remove('shake');
    }, 400);
  };

  function showWarningText(text) {
    let warningBox = document.querySelector('.word-warning');
    let warningText = document.querySelector('.word-warning-text');
    if (text) warningText.textContent = text;
    warningBox.classList.remove('invisible');
    setTimeout(() => {
      document.querySelector('.word-warning').classList.add('invisible');
    }, 750);
  };

  function gameCompleted() {
    let dailyWord = getStorage('turdle-daily-word').toLowerCase();
    let guesses = getStorage('turdle-data-key').guesses;
    let activeRow = getStorage('turdle-data-key').activeRow;

    // check guess is stored for current guess row
    if (guesses[activeRow] !== null) {
      // return true if latest stored guess === daily word
      if (guesses[activeRow].join('').toLowerCase() === dailyWord) return true;
    };
    return false;
  };

  async function updateLastGamePlayed() {
    let storage = getStorage('turdle-data-key');
    storage.playerStatistics.lastGamePlayed = new Date().toString().split(' ').slice(1, 4).join(' ');
    localStorage.setItem('turdle-data-key', JSON.stringify(storage));
  }

  async function handleGuess() {
    // game is finished
    if (activeRow === 6) return;

    // not a full word
    if (currentGuess.length !== 5) return;


    // guess is correct show stats and end game loop
    if (lowerCaseGuess() === getDailyWordFromStorage().toLowerCase()) {
      
      if (gameCompleted()) return;
      updateLastGamePlayed()
      storeGuessLocally();
      animateRowsAndPaintKeys(activeRow);
      
      setTimeout(() => {
        switch (activeRow) {
          case 0:
            showWarningText('WOW!')
            break;
          case 1:
            showWarningText('NICE!')
            break;
          case 2:
            showWarningText('GREAT!');
            break;
          case 3:
            showWarningText('SWEET!');
            break
          case 4: 
            showWarningText('GOOD JOB!');
            break
          case 5:
            showWarningText('PHEW!');
            break
          default:
            break;
        }
      }, 2000);

      storeCompletedGameStatistics();

      return;
    };
    
    // guess isn't in word list
    if (await guessIsInWordList() === false) {
      shakeRow();
      showWarningText('not in word list');
      return;
    };
    
    // all guesses used
    if (activeRow === 6) {
      storeCompletedGameStatistics();
      return;
    };

    // at this point guess is valid and game hasn't been won
    updateLastGamePlayed()
    storeGuessLocally();
    incrementLocallyStoredActiveRow();
    storeGuessesOnDB();
    setActiveRow(prev => prev + 1);
    animateRowsAndPaintKeys(activeRow);
    setCurrentGuess([]);
  };


  function animateRowsAndPaintKeys(row) {
    
    // create copy of daily word to mutate
    let tempDailyWord = getDailyWordFromStorage().toLowerCase().split('');

    let squares = document.querySelectorAll(`.guess-row-${row}>div`);

    // make a guess variable to 'encode' for each row to show the correct number of green
    // and yellow squares and in the correct positions
    let guess = [];
    squares.forEach(square => guess.push(square.textContent.toLowerCase()));

    
    // place 0s and 1s in for correct letters so correct letters get removed,
    // that way I can use 0s to paint the correct letters green (right letter right spot) without having 
    // the same letter in a previous position painted yellow (right letter wrong spot) unless it should be.
    // and use 1s to paint yellow without having to worry about multiple yellows (right letter wrong spot)
    // when there should only be one yellow.
    function encodeGuess() {
      // handle correct letters first and remove (change to 0s)
      for (let i = 0; i < 5; i++) {
        if (guess[i] === tempDailyWord[i]) {
          guess[i] = 0;
          tempDailyWord[i] = 0;
        }
      };
      for (let i = 0; i < 5; i++) {
        // handle right letter wrong position cases (exclude 0s for correct letters)
        if (guess[i] !== 0 && tempDailyWord.indexOf(guess[i]) !== -1) {
          tempDailyWord[tempDailyWord.indexOf(guess[i])] = 1;
          guess[i] = 1;
        }
      }
    };
    encodeGuess();

      // use variable for delay to 'chain' animations
    let timeDelay = 0;

      // manual index of guess letter for loop
    let guessLetterIndex = 0;

    // square animations begin here
    squares.forEach(square => {
      
      // rotate square out of view (y-axis 90 degrees)
      setTimeout(() => {
        square.classList.toggle('rotate-y');
      }, timeDelay);

      // paint square based on letter
      setTimeout(() => {
        
        // paint each squares background based on status of letter;
        // then paint key on keyboard as well
        switch(guess[guessLetterIndex]) {
          case 0: 
            // letter is in the correct position
            square.style.backgroundColor = 'rgb(5, 150, 105)';
            paintKey(square.textContent, 'rgb(5, 150, 105)');
            break;
          case 1:
            // letter is in the word in the wrong position
            square.style.backgroundColor = 'rgb(251, 191, 36)';
            paintKey(square.textContent, 'rgb(251, 191, 36)');
            break;
          default:
            // letter isn't in the word
            square.style.backgroundColor = 'rgb(113, 113, 122)';
            paintKey(square.textContent, 'rgb(113, 113, 122)');
            break;
        }

      // add 400ms so square is out of view before paint
      }, timeDelay + 400);
      
      setTimeout(() => {
        // rotate back after paint (+400 ms delay) and add one to index counter
        square.classList.toggle('rotate-y');
        guessLetterIndex++;
      }, timeDelay + 400);

      // add to time delay so next square begins animation as 
      // previous square is rotating back into view
      timeDelay+= 400
    });
  };

  function paintKey(letter, style) {
    let key = document.querySelector(`.letter.${letter.toLowerCase()}`);
    key.style.backgroundColor = style;
  };







  // storage related functions ----------

  function getDailyWordFromStorage() {
    return JSON.parse(localStorage.getItem('turdle-daily-word'));
  };

  function storeGuessLocally() {
    // make local storage copy
    let storage = getStorage('turdle-data-key');
    // store guess attempt in array
    let guess = []
    document.querySelectorAll(`.guess-row-${activeRow}>div`).forEach(square => {
      guess.push(square.textContent);
    })
    // store guess attempt to copy
    storage.guesses[activeRow] = guess;
    //store updated data locally
    localStorage.setItem('turdle-data-key', JSON.stringify(storage));
  };


  function incrementLocallyStoredActiveRow() {
    let storage = getStorage('turdle-data-key');
    storage.activeRow++;
    localStorage.setItem('turdle-data-key', JSON.stringify(storage));
  };


  
  async function storeCompletedGameStatistics() {
    let storage = getStorage('turdle-data-key');
    let stats = storage.playerStatistics;

    // increment games played
    stats.gamesPlayed += 1;

    // game finished incomplete
    if (storage.guesses[5] !== null 
      && storage.guesses[5].join('').toLowerCase() !== getDailyWordFromStorage().toLowerCase()) {
      stats.incomplete += 1;
    }
    // determine streak based on last game played
    function streak() {
      if (stats.lastGameCompleted === null) return false;
      // use UTC day (0-6 for mon-sun) to check within one day
      let lastDay = new Date(stats.lastGameCompleted).getUTCDay();
      let today = new Date().getUTCDay();
      // check days are also within 48 hours
      if (lastDay + 1 === today || (lastDay === 6 && today === 0)) {
          // 172_800_000 ms === 48 hours
        if (new Date().getTime() - new Date(stats.lastGameCompleted).getTime() < 172_800_000) {
          return true;
        }
      }
      return false;
    };
    
    if (streak()) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    };

    

    // set 'new' last game played
    stats.lastGameCompleted = new Date().toString().split(' ').slice(1, 4).join(' ');

    // determine win percentage
    let winPercentage;
    if (stats.incomplete === 0) {
      winPercentage = 100;
    } else {
      winPercentage = Math.floor((((stats.gamesPlayed - stats.incomplete) / stats.gamesPlayed) * 100));
    }
    stats.winPercentage = winPercentage;


    // increase corresponding 'guessed in X' statistic
    switch(storage.activeRow) {
      case 0:
        stats.guessedIn.one += 1;
        break;
      case 1: 
        stats.guessedIn.two += 1;
        break;
      case 2:
        stats.guessedIn.three += 1;
        break;
      case 3:
        stats.guessedIn.four += 1;
        break;
      case 4: 
        stats.guessedIn.five += 1;
        break;
      case 5:
        stats.guessedIn.six += 1;
        break;
      default:
        break;
    };

    
    if (stats.currentStreak > stats.maxStreak 
      || stats.maxStreak === null) stats.maxStreak = stats.currentStreak;

    //update user data on db
    if (user !== 'guest') {
      const usersRef = collection(getFirestore(), "users");
      await setDoc(doc(usersRef, user), {
        info: storage
      }, {merge: true});
    };
      
    //update user data in local storage
    localStorage.setItem('turdle-data-key', JSON.stringify(storage));
    updateStatisticsData();
    setTimeout(() => {
      openStatistics();
    }, 3500);
  };


  async function storeGuessesOnDB() {
    if (user !== 'guest') {
      const usersRef = collection(getFirestore(), "users");
      await setDoc(doc(usersRef, user), {
        info: getStorage('turdle-data-key')
      }, {merge: true});
    }
  };

  
  const boxStyles = {
    backgroundColor: '#c1c1c1'
  };

  return (
    <div
    className='game w-screen flex-grow flex flex-col'
    style={styles}
    onLoad={() => {
      fillStoredGuesses()
    }}
    onClick={closeMenu}
    >
      <div 
        className="word-warning w-auto bg-red-50 border border-black rounded-md p-2 
        absolute mx-auto left-0 right-0 text-center w-max -mt-2 z-10 invisible"
      >
        <p className='word-warning-text font-bold text-gray-900 text-lg'></p>
      </div>
      <div
        className="game-screen w-full flex-grow flex flex-col items-center gap-1 pb-2 pt-2"
      >
        <div className="guess-row guess-row-0 flex-1 flex items-center gap-3">
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-1 flex-1 flex items-center gap-3">
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-2 flex-1 flex items-center gap-3">
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-3 flex-1 flex items-center gap-3">
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-4 flex-1 flex items-center gap-3">
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-5 flex-1 flex items-center gap-3">
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
          <div style={boxStyles} className="guess-box flex justify-center items-center"></div>
        </div>
        
      </div>
      <Keyboard 
        handleLetterInput={handleLetterInput}
        handleBackspace={handleBackspace}
        handleGuess={handleGuess}
      />
    </div>
    
  )
}
