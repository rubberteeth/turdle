import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";  


import Keyboard from './Keyboard'


export default function Game( { closeMenu } ) {

  const [dailyWord, setDailyWord] = useState('poser')
  const [currentGuess, setCurrentGuess] = useState([])
  const [activeRow, setActiveRow] = useState(0)



  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  function fillStoredGuesses() {
    let storage = JSON.parse(localStorage.getItem('turdle-data-key'));
    const guessRows = storage.guesses
    // if no stored guesses, return
    if (guessRows[0] === null) return

    for (let row in guessRows) {
      // if all stored guesses filled in, return
      if (guessRows[row] === null) return 
      console.log('filling in row: ', row)
      let index = 0
      let guess = guessRows[row]
      let currentGuessRow = document.querySelectorAll(`.guess-row-${row}>div`)
      currentGuessRow.forEach(square => {
        square.textContent = guess[index]
        index++
      })
      animateRowsAndPaintKeys(row)
    }
    
  }

  useEffect(() => {
    // get locally stored active row
    let storage = JSON.parse(localStorage.getItem('turdle-data-key'));
    setActiveRow(storage.activeRow)

    function updateGuess() {
      // fill in corresponding row with current guess each time guess changes
      let guessRow = document.querySelectorAll(`.guess-row-${activeRow}>div`);
      for (let i = 0; i < 5; i++) {
        guessRow[i].textContent = currentGuess[i]
      }
    }    
    updateGuess()
  },[currentGuess, activeRow])
    


  function incrementLocallyStoredActiveRow() {
    let storage = JSON.parse(localStorage.getItem('turdle-data-key'));
    storage.activeRow++;
    localStorage.setItem('turdle-data-key', JSON.stringify(storage))
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
    const wordsRef = doc(getFirestore(), 'words', 'list')
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
    }, 700);
  }

  async function handleGuess() {
    // if not a full word return
    if (currentGuess.length !== 5) return


    // if guess is correct show stats and end game loop
    if (lowerCaseGuess() === dailyWord.toLowerCase()) {
      storeGuess()
      animateRowsAndPaintKeys(activeRow)
      // set some sort of game win state that will use todays date ,
      // so that it wont re animate every time you click enter but will 
      // not affect the next day's game 
      // ie. setFakeGameWinState(new Date().getDate())

      // async func to store guess data to DB and reset local storage data


      // show stats


      return
    }
    
    // if guess isn't in word list
    if (await guessIsInWordList() === false) {
      animateWrongGuess()
      showNotValidWordWarning()
      return
    }
    
    
    

    // if full word, not correct word, and guess is in word list
    if (activeRow < 5) {
      storeGuess()
      animateRowsAndPaintKeys(activeRow);
      setCurrentGuess([])
      incrementLocallyStoredActiveRow()
      setActiveRow(prev => prev + 1)
    }
    
  }


  function animateRowsAndPaintKeys(row) {
    let tempDailyWord = dailyWord.split('')
    let timeDelay = 0;
    // manual index of guess letter for loop
    let guessLetterIndex = 0

    let squares = document.querySelectorAll(`.guess-row-${row}>div`);

    function encodeDailyWord() {
      // use 0s and 1s to cleanly paint key without having to worry about 
      // repeating letters and special cases ( 1 for correct position and
      // 0 for correct letter but wrong position)
      let count = 0;
      squares.forEach(square => {
        if (tempDailyWord[count] === square.textContent.toLowerCase()) {
          tempDailyWord[count] = 1;
        }
        count++
      })
    }
    encodeDailyWord()

    squares.forEach(square => {
      // rotate square out of view (y-axis 90 degrees)
      setTimeout(() => {
        square.classList.toggle('rotate-y');
      }, timeDelay);
      
      // paint square based on letter
      setTimeout(() => {
        // paint each squares background based on status of letter;
        // then paint key on keyboard as well

        if (tempDailyWord[guessLetterIndex] === 1) {
          // letter is in the correct position
            square.classList.add('bg-green-600')
            paintKey(square.textContent, 'rgb(5, 150, 105)')
        }
          // letter is in the word but in the wrong position
        else if (tempDailyWord.indexOf(square.textContent.toLowerCase()) === -1) {
            square.classList.add('bg-yellow-700');
            paintKey(square.textContent, 'rgb(180, 83, 9)')
        } else {
            square.classList.add('bg-yellow-300')
            paintKey(square.textContent, 'rgb(252, 211, 77)')
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

  function storeGuess() {
    // make local storage copy
    let storage = JSON.parse(localStorage.getItem('turdle-data-key'));

    // store guess attempt in array
    let guess = []
    document.querySelectorAll(`.guess-row-${activeRow}>div`).forEach(square =>{
      guess.push(square.textContent);
    })

    // store guess attempt locally
    storage.guesses[activeRow] = guess;

    //store updated data locally
    localStorage.setItem('turdle-data-key', JSON.stringify(storage))
  }

  // function fillStoredGuesses() {
  //   let storage = JSON.parse(localStorage.getItem('turdle-data-key'));
  //   const guessRows = storage.guessRow
  //   if (guessRows[0] === null) return
  //   for (let row in guessRows) {
  //     if (guessRows[row] === null) return 
  //     console.log(row);
  //   }
  // }


  return (
    <div
    className='game w-screen flex-grow flex flex-col'
    style={styles}
    onLoad={fillStoredGuesses}
    onClick={closeMenu}
    >
      <button className='border-2 p-4 ' onClick={storeGuess}>TEST</button>
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
