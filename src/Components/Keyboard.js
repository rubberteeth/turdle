import React from 'react'
import backspace from '../Assets/Pictures/backspace.png'



export default function Keyboard( { currentGuess, setCurrentGuess, activeRow, setActiveRow } ) {


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

  function handleGuessSubmit() {
    if (currentGuess.length !== 5) return
    
    // if (currentGuess.join() is not in word list) {
    // give error and return
    // }
    
    // if (currentGuess === dailyWord) {
    //   win game 
    //   show stats
    //   return
    // }

    if (activeRow < 6) {
      console.log(currentGuess.join(''))
      setCurrentGuess([])
      setActiveRow(prev => prev + 1)
    }
    
  }

  

  return (
    <div className='keyboard w-screen flex flex-col gap-2 self-end items-center pb-2'>
      <div className='row-1 flex gap-0.5'>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>Q</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>W</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>E</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>R</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>T</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>Y</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>U</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>I</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>O</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>P</div>
      </div>
      <div className='spaced-row'>
        <div className='row-2 flex gap-0.5'>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>A</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>S</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>D</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>F</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>G</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>H</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>J</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>K</div>
          <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>L</div>
        </div>
        
      </div>
      <div className='row-3 flex gap-0.5 w-full px-2'>
        <div 
          className='enter'
          onClick={handleGuessSubmit}
        >
          ENTER
        </div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>Z</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>X</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>C</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>V</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>B</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>N</div>
        <div className='letter' onClick={(e) => {handleLetterInput(e.target.textContent)}}>M</div>
        
        <div 
          className='backspace'
          onClick={handleBackspace}  
        >
          <img className='h-2/5' src={backspace} alt="<"/>
        </div>
      </div>
    </div>
  )
}
