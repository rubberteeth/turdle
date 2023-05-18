import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'

import Keyboard from './Keyboard'

// import Words from './Words'

export default function Game( { closeMenu } ) {
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
    
  })


  return (
    <div
    className='game w-screen flex-grow flex flex-col'
    style={styles}
    onClick={closeMenu}
    >
      <div
        className="game-screen w-full flex-grow flex flex-col items-center gap-1 pb-2"
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
      />
    </div>
    
  )
}
