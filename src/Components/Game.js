import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'

import Keyboard from './Keyboard'

// import Words from './Words'

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


  useEffect(() => {
    setTempWord('gamer')
  }, [])


  function animateRow() {
    let i = 400;
    let guessLetter = 0
    document.querySelectorAll(`.guess-row-${activeRow}>div`).forEach(square => {
      setTimeout(() => {
        square.classList.add('rotate-y')
      }, i);
      i+= 400
    })
    
  }


  // async function addGameToDatabase() {
  // if no word exists for today's date, set one.
  

  //   // Add a new timestamp entry to the Firebase database.
  //   try {
  //     let ref = await addDoc(collection(getFirestore(), `${puzzle.name}`), {
  //       name: getUserName(),
  //       startTime: serverTimestamp()
  //     });
  //     setdbRefID(ref.id)
  //   }
  //   catch(error) {
  //     console.error('Error writing new score to Firebase Database', error);
  //   }
  // }




  return (
    <div
    className='game w-screen flex-grow flex flex-col'
    style={styles}
    onClick={closeMenu}
    >
      <button className='border-2 w-8 h-8' onClick={animateRow}>animate</button>
      <div 
        className="word-warning w-auto bg-white border border-black rounded-md p-2 
        absolute mx-auto left-0 right-0 text-center w-max -mt-2 z-10 opacity-0"
      >
        <p className='font-bold text-lg'>not in word list</p>
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
        currentGuess={currentGuess}
        setCurrentGuess={setCurrentGuess}
        activeRow={activeRow}
        setActiveRow={setActiveRow}
        tempWord={tempWord}
      />
    </div>
    
  )
}
