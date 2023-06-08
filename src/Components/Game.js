import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'
import { doc, getDoc, getFirestore } from "firebase/firestore";  


import Keyboard from './Keyboard'

function getStorage() {
  return JSON.parse(localStorage.getItem('turdle-data-key'))
}


export default function Game( { closeMenu, user } ) {

  const [currentGuess, setCurrentGuess] = useState([])
  const [activeRow, setActiveRow] = useState(0)



  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#fefefe' : '#111',
  }

  useEffect(() => {
    function updateGuess() {
      // fill in corresponding row with current guess each time guess changes
      let guessRow = document.querySelectorAll(`.guess-row-${activeRow}>div`);
      for (let i = 0; i < 5; i++) {
        guessRow[i].textContent = currentGuess[i]
      }
    }  
    // check game is still being played
    if (activeRow < 6) updateGuess()
  },[currentGuess, activeRow, ])


  async function fillStoredGuesses() {
    let guesses;
    if (user === 'guest') guesses = getStorage().guesses
    else {
      const docRef = doc(getFirestore(), "users", user);
      const docSnap = await getDoc(docRef);
      guesses = docSnap.data().info.guesses
    }


    // if no stored guesses, return
    if (guesses[0] === null) return
    for (let row in guesses) {
      // if all stored guesses filled in, return
      if (guesses[row] === null) return 
      let index = 0
      let guess = guesses[row]
      let currentGuessRow = document.querySelectorAll(`.guess-row-${row}>div`)
      currentGuessRow.forEach(square => {
        square.textContent = guess[index]
        index++
      })
      console.log(guess)
      animateRowsAndPaintKeys(row)
    }
  }


  function handleBackspace() {
    if (!currentGuess.length) return ;
    setCurrentGuess(prev => [...prev.slice(0, prev.length - 1)])
  }

  function handleLetterInput(letter) {
    if (currentGuess.length === 5) return;
    setCurrentGuess(prev => [...prev, letter])
  } 

  function lowerCaseGuess() {
    return currentGuess.join('').toLowerCase();
  }

  async function guessIsInWordList() {
    const wordsRef = doc(getFirestore(), 'words', 'fullWordsList')
    const wordsSnap = await getDoc(wordsRef);
    if (wordsSnap.exists()) {
        // return boolean of wether word is in valid words list
      return wordsSnap.data().validWordsList.indexOf(lowerCaseGuess()) !== -1
    }
  }

  function animateWrongGuess() {
    let guessRow = document.querySelector(`.guess-row-${activeRow}`);
    guessRow.classList.add('shake')
    setTimeout(() => {
      guessRow.classList.remove('shake')
    }, 400)
  }

  function showNotValidWordWarning() {
    document.querySelector('.word-warning').classList.remove('invisible');
    setTimeout(() => {
      document.querySelector('.word-warning').classList.add('invisible');
    }, 750);
  }

  async function handleGuess() {
    // game is finished
    if (activeRow === 6) return

    // not a full word
    if (currentGuess.length !== 5) return


    // guess is correct show stats and end game loop
    if (lowerCaseGuess() === getDailyWordFromStorage().toLowerCase()) {
      storeGuessLocally()
      animateRowsAndPaintKeys(activeRow)
      // set some sort of game win state that will use todays date ,
      // so that it wont re animate every time you click enter but will 
      // not affect the next day's game 
      // ie. setFakeGameWinState(new Date().getDate())

      // async func to store guess data to DB and reset local storage data


      // show stats


      return
    }
    
    // guess isn't in word list
    if (await guessIsInWordList() === false) {
      animateWrongGuess()
      showNotValidWordWarning()
      return
    }
    
    
    

    // full word, not correct word, and guess is in word list
    if (activeRow < 6) {
      storeGuessLocally()
      incrementLocallyStoredActiveRow()
      setActiveRow(prev => prev + 1)
      animateRowsAndPaintKeys(activeRow);
      setCurrentGuess([])
    }
    
  }


  function animateRowsAndPaintKeys(row) {
    
    // create copy of daily word to mutate
    let tempDailyWord = getDailyWordFromStorage().toLowerCase().split('');

    let squares = document.querySelectorAll(`.guess-row-${row}>div`);

    // make a guess variable to 'encode' for each row to show the correct number of green
    // and yellow squares and in the correct positions
    let guess = [];
    squares.forEach(square => guess.push(square.textContent.toLowerCase()))

    
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
      }
      for (let i = 0; i < 5; i++) {
        // handle right letter wrong position cases (exclude 0s for correct letters)
        if (guess[i] !== 0 && tempDailyWord.indexOf(guess[i]) !== -1) {
          tempDailyWord[tempDailyWord.indexOf(guess[i])] = 1
          guess[i] = 1;
        }
      }
    }
    encodeGuess()

      // use variable for delay to 'chain' animations
    let timeDelay = 0;

      // manual index of guess letter for loop
    let guessLetterIndex = 0

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
            square.classList.add('bg-green-600')
            paintKey(square.textContent, 'rgb(5, 150, 105)')
            break
          case 1:
            // letter is in the word in the wrong position
            square.classList.add('bg-yellow-400')
            paintKey(square.textContent, 'rgb(251, 191, 36)')
            break
          default :
            // letter isn't in the word
            square.classList.add('bg-zinc-500');
            paintKey(square.textContent, 'rgb(113, 113, 122)')
            break
        }

      // add 400ms so square is out of view before paint
      }, timeDelay + 400);
      
      setTimeout(() => {
        // rotate back after paint (+400 ms delay) and add one to index counter
        square.classList.toggle('rotate-y');
        guessLetterIndex++
      }, timeDelay + 400);

      // add to time delay so next square begins animation as 
      // previous square is rotating back into view
      timeDelay+= 400
    })
  }

  function paintKey(letter, style) {
    let key = document.querySelector(`.letter.${letter.toLowerCase()}`)
    key.style.backgroundColor = style;
  }







  // storage related functions ----------

  function getDailyWordFromStorage() {
    return JSON.parse(localStorage.getItem('turdle-daily-word'));
  }

  function storeGuessLocally() {
    // make local storage copy
    let storage = getStorage();
    // store guess attempt in array
    let guess = []
    document.querySelectorAll(`.guess-row-${activeRow}>div`).forEach(square => {
      guess.push(square.textContent);
    })
    // store guess attempt to copy
    storage.guesses[activeRow] = guess;
    //store updated data locally
    localStorage.setItem('turdle-data-key', JSON.stringify(storage))
  }


  function incrementLocallyStoredActiveRow() {
    let storage = getStorage();
    storage.activeRow++;
    localStorage.setItem('turdle-data-key', JSON.stringify(storage))
  }


  
  function storeCompletedGameStatistics() {
    let storage = getStorage();
    let stats = storage.playerStatistics;

    // increment games played
    stats.gamesPlayed += 1;

    // game finished incomplete
    if (storage.guesses[5] !== null 
      && storage.guesses[5].join('').toLowerCase() !== getDailyWordFromStorage().toLowerCase()) {
      stats.incomplete += 1
    }
    // determine streak based on last game played
    function streak() {
      if (stats.lastGamePlayed === null) return false;
      // use UTC day (0-6 for mon-sun) to check within one day
      let lastDay = new Date(stats.lastGamePlayed).getUTCDay();
      let today = new Date().getUTCDay();
      // check days are also within 48 hours
      console.log(today)
      if (lastDay + 1 === today || (lastDay === 6 && today === 0)) {
          // 172_800_000 ms === 48 hours
        if (new Date().getTime() - new Date(stats.lastGamePlayed).getTime() < 172_800_000) {
          return true;
        }
      }
      return false
    } 
    
    if (streak()) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }

    

    // set 'new' last game played
    stats.lastGamePlayed = new Date().toString().split(' ').slice(1, 4).join(' ');

    // determine win percentage
    let winPercentage
    if (stats.incomplete === 0) {
      winPercentage = 100
    } else {
      winPercentage = Math.floor((((stats.gamesPlayed - stats.incomplete) / stats.gamesPlayed) * 100))
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
    }

    
    if (stats.currentStreak > stats.maxStreak 
      || stats.maxStreak === null) stats.maxStreak = stats.currentStreak;

    

    
    console.log(storage)
    localStorage.setItem('turdle-data-key', JSON.stringify(storage))
  }

  

  return (
    <div
    className='game w-screen flex-grow flex flex-col'
    style={styles}
    onLoad={() => {
      let storage = getStorage();
       
      // get locally stored active row
      setActiveRow(storage.activeRow)

      fillStoredGuesses()
    }}
    onClick={closeMenu}
    >
      <button className='p-4 border-2' onClick={storeCompletedGameStatistics}>TEST</button>
      <div 
        className="word-warning w-auto bg-red-50 border border-black rounded-md p-2 
        absolute mx-auto left-0 right-0 text-center w-max -mt-2 z-10 invisible"
      >
        <p className='font-bold text-gray-900 text-lg'>not in word list</p>
      </div>
      <div
        className="game-screen w-full flex-grow flex flex-col items-center gap-1 pb-2 pt-2"
      >
        <div className="guess-row guess-row-0 flex-1 flex items-center gap-3">
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-1 flex-1 flex items-center gap-3">
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-2 flex-1 flex items-center gap-3">
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-3 flex-1 flex items-center gap-3">
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-4 flex-1 flex items-center gap-3">
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
        </div>
        <div className="guess-row guess-row-5 flex-1 flex items-center gap-3">
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
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
