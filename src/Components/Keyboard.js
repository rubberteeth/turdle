import React from 'react'
import backspace from '../Assets/Pictures/backspace.png'
import { useTheme } from '../ThemeContext'



export default function Keyboard( { 
  handleLetterInput,
  handleGuess,
  handleBackspace
  } ) {

  const darkTheme = useTheme()

  const keyStyles = {
    backgroundColor: darkTheme ? 'rgb(75, 85, 99)' : 'rgb(220, 220, 220)'
  }

  

  return (
    <div className='keyboard w-screen flex flex-col gap-2 self-end items-center pb-2'>
      <div className='row-1 flex gap-0.5'>
        <div style={keyStyles} className='letter q' onClick={(e) => {handleLetterInput(e.target.textContent)}}>Q</div>
        <div style={keyStyles} className='letter w' onClick={(e) => {handleLetterInput(e.target.textContent)}}>W</div>
        <div style={keyStyles} className='letter e' onClick={(e) => {handleLetterInput(e.target.textContent)}}>E</div>
        <div style={keyStyles} className='letter r' onClick={(e) => {handleLetterInput(e.target.textContent)}}>R</div>
        <div style={keyStyles} className='letter t' onClick={(e) => {handleLetterInput(e.target.textContent)}}>T</div>
        <div style={keyStyles} className='letter y' onClick={(e) => {handleLetterInput(e.target.textContent)}}>Y</div>
        <div style={keyStyles} className='letter u' onClick={(e) => {handleLetterInput(e.target.textContent)}}>U</div>
        <div style={keyStyles} className='letter i' onClick={(e) => {handleLetterInput(e.target.textContent)}}>I</div>
        <div style={keyStyles} className='letter o' onClick={(e) => {handleLetterInput(e.target.textContent)}}>O</div>
        <div style={keyStyles} className='letter p' onClick={(e) => {handleLetterInput(e.target.textContent)}}>P</div>
      </div>
      <div className='spaced-row'>
        <div className='row-2 flex gap-0.5'>
          <div style={keyStyles} className='letter a' onClick={(e) => {handleLetterInput(e.target.textContent)}}>A</div>
          <div style={keyStyles} className='letter s' onClick={(e) => {handleLetterInput(e.target.textContent)}}>S</div>
          <div style={keyStyles} className='letter d' onClick={(e) => {handleLetterInput(e.target.textContent)}}>D</div>
          <div style={keyStyles} className='letter f' onClick={(e) => {handleLetterInput(e.target.textContent)}}>F</div>
          <div style={keyStyles} className='letter g' onClick={(e) => {handleLetterInput(e.target.textContent)}}>G</div>
          <div style={keyStyles} className='letter h' onClick={(e) => {handleLetterInput(e.target.textContent)}}>H</div>
          <div style={keyStyles} className='letter j' onClick={(e) => {handleLetterInput(e.target.textContent)}}>J</div>
          <div style={keyStyles} className='letter k' onClick={(e) => {handleLetterInput(e.target.textContent)}}>K</div>
          <div style={keyStyles} className='letter l' onClick={(e) => {handleLetterInput(e.target.textContent)}}>L</div>
        </div>
        
      </div>
      <div className='row-3 flex gap-0.5 w-full px-1'>
        <div 
          style={keyStyles}
          className='enter'
          onClick={handleGuess}
        >
          ENTER
        </div>
        <div style={keyStyles} className='letter z' onClick={(e) => {handleLetterInput(e.target.textContent)}}>Z</div>
        <div style={keyStyles} className='letter x' onClick={(e) => {handleLetterInput(e.target.textContent)}}>X</div>
        <div style={keyStyles} className='letter c' onClick={(e) => {handleLetterInput(e.target.textContent)}}>C</div>
        <div style={keyStyles} className='letter v' onClick={(e) => {handleLetterInput(e.target.textContent)}}>V</div>
        <div style={keyStyles} className='letter b' onClick={(e) => {handleLetterInput(e.target.textContent)}}>B</div>
        <div style={keyStyles} className='letter n' onClick={(e) => {handleLetterInput(e.target.textContent)}}>N</div>
        <div style={keyStyles} className='letter m' onClick={(e) => {handleLetterInput(e.target.textContent)}}>M</div>
        
        <div 
          style={keyStyles}
          className='backspace'
          onClick={handleBackspace}  
        >
          <img className='h-2/5' src={backspace} alt="<"/>
        </div>
      </div>
    </div>
  )
}
