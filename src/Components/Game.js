import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'
import { qualityWordsArray } from '../Assets/Data/qualityWords'

import Keyboard from './Keyboard'

import Words from './Words'



const playerStats = {
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
  lastGamePlayed: new Date(),
}




export default function Game( { closeMenu } ) {

  const [tempWord, setTempWord] = useState('gamer')

  const [currentGuess, setCurrentGuess] = useState([])
  const [activeRow, setActiveRow] = useState(1)


  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  useEffect(() => {
    let guessRow = document.querySelectorAll(`.guess-row-${activeRow}>div`);
    for (let i = 0; i < 5; i++) {
      guessRow[i].textContent = currentGuess[i]
    }
  }, [currentGuess, activeRow])



  function handleBackspace() {
    if (!currentGuess.length) return ;
    setCurrentGuess(prev => {
      return [...prev.slice(0, prev.length - 1)]
    })
  }

  function handleLetterInput(letter) {
    if (currentGuess.length === 5) return;
    setCurrentGuess(prev => [...prev, letter])
  } 

  // function storeGuessDataLocally() {

  // }

  function lowerCaseGuess() {
    return currentGuess.join('').toLowerCase();
  }

  function guessIsInWordList() {
    if (qualityWordsArray.indexOf(lowerCaseGuess()) === -1) return false
    else return true
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
    }, 700);
  }

  function handleGuess() {
    // if not a full word return
    if (currentGuess.length !== 5) return
    
    // if guess isn't in word list
    if (guessIsInWordList() === false) {
      animateWrongGuess()
      showNotValidWordWarning()
      return
    }
    
    
    // if guess is correct show stats and end game loop
    if (lowerCaseGuess() === tempWord.toLowerCase()) {
      animateRow()
      // set some sort of game win state that will use todays date ,
      // so that it wont re animate every time you click enter but will 
      // not affect the next day's game 
      // ie. setFakeGameWinState(new Date().getDate())


      // show stats

      return
    }

    // if full word, not correct word, and guess is in word list
    if (activeRow < 6) {
      setCurrentGuess([])
      animateRow();
      setActiveRow(prev => prev + 1)
    }
    
  }


  function animateRow() {
    let timeDelay = 0;
    // manual index of guess letter for loop
    let guessLetter = 0
    document.querySelectorAll(`.guess-row-${activeRow}>div`).forEach(square => {
      // rotate square out of view (y-axis 90 degrees)
      setTimeout(() => {
        square.classList.toggle('rotate-y');
      }, timeDelay);
      
      // paint square based on letter
      setTimeout(() => {
        // paint each squares background based on status of letter;
        // then paint key on keyboard as well
        switch (tempWord.indexOf(currentGuess[guessLetter].toLowerCase())) {
          // letter is in the correct position
          case guessLetter:
            square.classList.add('bg-green-600')
            paintKey(currentGuess[guessLetter], 'rgb(5, 150, 105)')
            break;
          // letter isn't in the word
          case -1:
            square.classList.add('bg-yellow-700');
            paintKey(currentGuess[guessLetter], 'rgb(180, 83, 9)')
            break
          // letter is in the word but in the wrong position
          default:
            square.classList.add('bg-yellow-300')
            paintKey(currentGuess[guessLetter], 'rgb(252, 211, 77)')

            break;
        }

      // add 400ms so square is out of view before paint
      }, timeDelay + 400);
      
      setTimeout(() => {
        // rotate back after paint (+400 ms delay) and add one to index counter
        square.classList.toggle('rotate-y');
        guessLetter++
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


  return (
    <div
    className='game w-screen flex-grow flex flex-col'
    style={styles}
    onClick={closeMenu}
    >
      {/* <button className='border-2 p-4 ' onClick={() => paintKey('Q', 'bg-yellow-800')}>TEST</button> */}
      <div 
        className="word-warning w-auto bg-red-50 border border-black rounded-md p-2 
        absolute mx-auto left-0 right-0 text-center w-max -mt-2 z-10 invisible"
      >
        <p className='font-bold text-gray-900 text-lg'>not in word list</p>
      </div>
      <div
        className="game-screen w-full flex-grow flex flex-col items-center gap-1 pb-2 pt-2"
      >
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
        <div className="guess-row guess-row-6 flex-1 flex items-center gap-3">
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
          <div className="guess-box flex justify-center items-center"></div>
        </div>
        


        {/* <Words /> */}
      </div>
      <Keyboard 
        handleLetterInput={handleLetterInput}
        handleBackspace={handleBackspace}
        handleGuess={handleGuess}
      />
    </div>
    
  )
}
