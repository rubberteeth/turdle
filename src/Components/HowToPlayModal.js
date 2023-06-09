import React from 'react'
import { useTheme } from '../ThemeContext'

export default function HowToPlayModal( { closeHowTo } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  const darkDialog = {
    backgroundColor: darkTheme ? 'rgb(31, 41, 55)' : 'rgb(225, 240, 255)'
  }

  function showPageTwoOfHowTo() {
    const dialog = document.querySelector('.page-1');
    dialog.close()
    dialog.classList.remove('show')
    const pageTwo = document.querySelector('.page-2');
    pageTwo.showModal();
    pageTwo.classList.add('show')
  };

  return (
    <div className='font-quicksand'>
      <dialog 
        style={styles}
        className='page-1 text-center text-xl bg-green-50 rounded-xl 
        shadow-lg border-4 border-gray-800 w-full p-8'
      >
        <p className='font-bold py-8'>
          You have 6 chances to guess the 5 letter word, 
          your goal is to guess the word in the least amount of tries.
          <br/>
          <br/>
          You will receive a warning for invalid guesses

        </p>
        <button 
          className='text-md w-4/6 mt-8 mb-4 rounded-lg border-2 bg-green-600 border-gray-800 
          pt-2 pb-2 font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
          onClick={showPageTwoOfHowTo}
        >
            Next
        </button>
      </dialog>
      <dialog 
        style={styles}
        className='page-2 text-center text-xl bg-green-50 rounded-xl p-8
        shadow-lg border-4 border-gray-800'
      >
        <p className='py-4 font-bold'>
          Letter backgrounds in game will change color depending on their state:
        </p>
        <ul 
          style={darkDialog}
          className='flex flex-col gap-6 mt-8 mb-8 shadow-lg border-2
          border-zinc-400 py-6 px-4 rounded-md font-bold'
        >
          <li className='flex gap-2 items-center text-left'>
            <div className='h-8 w-8 bg-zinc-500 flex-shrink-0'></div>
            <p>Letter is <em>not</em> in the word</p>
          </li>
          <li className='flex gap-2 items-center text-left'>
            <div className='h-8 w-8 bg-yellow-400 flex-shrink-0'></div>
            <p>Letter is in the word, <em>but in the wrong position</em></p>
          </li>
          <li className='flex gap-2 items-center text-left'>
            <div className='h-8 w-8 bg-green-600 flex-shrink-0'></div>
            <p>Letter is in the correct position</p>
          </li>
        </ul>
        <button 
          className='text-md w-4/6 rounded-lg border-2 bg-green-600 border-gray-800 
          pt-2 pb-2 font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
          onClick={closeHowTo}>
            Got it!
        </button>
      </dialog>
    </div>
  )
}
