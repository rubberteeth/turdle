import React from 'react'
import backspace from '../Assets/Pictures/backspace.png'

export default function Keyboard() {
  return (
    <div className='keyboard w-screen flex flex-col gap-2 self-end items-center pb-2'>
      <div className='row-1 flex gap-0.5'>
        <div>Q</div>
        <div>W</div>
        <div>E</div>
        <div>R</div>
        <div>T</div>
        <div>Y</div>
        <div>U</div>
        <div>I</div>
        <div>O</div>
        <div>P</div>
      </div>
      <div className='spaced-row'>
        <div className='row-2 flex gap-0.5'>
          <div>A</div>
          <div>S</div>
          <div>D</div>
          <div>F</div>
          <div>G</div>
          <div>H</div>
          <div>J</div>
          <div>K</div>
          <div>L</div>
        </div>
        
      </div>
      <div className='row-3 flex gap-0.5 w-full px-2'>
        <div className='enter'>ENTER</div>
        <div>Z</div>
        <div>X</div>
        <div>C</div>
        <div>V</div>
        <div>B</div>
        <div>N</div>
        <div>M</div>
        
        <div className='backspace'>
          <img className='h-3/5' src={backspace} alt="<"/>
        </div>
      </div>
    </div>
  )
}
