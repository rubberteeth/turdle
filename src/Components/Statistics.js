import React from 'react'
import { useTheme } from '../ThemeContext';
import shareIcon from '../Assets/Pictures/share.png'

export default function Statistics( { closeStatistics } ) {

  const darkTheme = useTheme();

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  };


  return (
    <dialog 
      style={styles}
      className='statistics font-quicksand text-2xl bg-green-50 rounded-xl 
      shadow-lg border-4 border-gray-800 w-full p-8 h-max' 
    >
      <button 
        className='exit-button absolute top-1 right-2 text-2xl font-bold py-2 px-3'
        onClick={() => {
          closeStatistics()
        }}
      > 
        X
      </button>
      <h3 className='pb-2 font-bold'>STATISTICS</h3>
      <div className="header-stats flex justify-between pb-2">
        <div className='flex flex-col items-center'>
          <p className='games-played text-3xl font-bold'></p>
          <p className='text-sm w-max font-bold'>Played</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='win-percentage text-3xl font-bold'></p>
          <p className='text-sm w-max font-bold'>Win %</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='current-streak text-3xl font-bold'></p>
          <p className='text-sm w-max font-bold'>Current Streak</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='max-streak text-3xl font-bold'></p>
          <p className='text-sm w-max font-bold'>Max Streak</p>
        </div>
      </div>
      <h3 className='pb-2 font-bold'>GUESS DISTRIBUTION</h3>
      <div className="guess-distribution flex flex-col gap-1">
        <div className='flex gap-3'>
          <p className='w-6'>1</p>
          <div className='gi-1 bg-green-600 flex justify-end'>
            <p className='gi-1 mr-2'></p>
          </div>
        </div>
        <div className='flex gap-3'>
          <p className='w-6'>2</p>
          <div className='gi-2 bg-green-600 flex justify-end'>
            <p className='gi-2 mr-2'></p>
          </div>
        </div>
        <div className='flex gap-3'>
          <p className='w-6'>3</p>
          <div className='gi-3 bg-green-600 flex justify-end'>
            <p className='gi-3 mr-2'></p>
          </div>
        </div>
        <div className='flex gap-3'>
          <p className='w-6'>4</p>
          <div className='gi-4 bg-green-600 flex justify-end'>
            <p className='gi-4 mr-2'></p>
          </div>
        </div>
        <div className='flex gap-3'>
          <p className='w-6'>5</p>
          <div className='gi-5 bg-green-600 flex justify-end'>
            <p className='gi-5 mr-2'></p>
          </div>
        </div>
        <div className='flex gap-3'>
          <p className='w-6'>6</p>
          <div className='gi-6 bg-green-600 flex justify-end'>
            <p className='gi-6 mr-2'></p>
          </div>
        </div>
      </div>

      <div className='w-full flex justify-center'>
        <button 
          className='w-40 bg-green-500 rounded-xl flex justify-around items-center font-bold'
          >SHARE <img className='w-5' src={shareIcon} alt="share icon" />
        </button>
        
      </div>
      
    </dialog>
  )
}
