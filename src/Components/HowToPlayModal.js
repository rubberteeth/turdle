import React from 'react'
import { useTheme } from '../ThemeContext'

export default function HowToPlayModal() {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(114, 43, 0)' : 'rgb(255, 251, 235)',
    color: darkTheme ? '#eee' : '#111',
  }

  const darkDialog = {
    backgroundColor: darkTheme ? 'rgb(31, 41, 55)' : 'rgb(249, 250, 251)'
  }

  function showPageTwoOfHowTo() {
    const dialog = document.querySelector('.page-1');
    dialog.close()
    dialog.classList.remove('show')
    const pageTwo = document.querySelector('.page-2');
    pageTwo.showModal();
    pageTwo.classList.add('show')
  };

  function closeHowTo() {
    const pageTwo = document.querySelector('.page-2');
    pageTwo.classList.remove('show');
    setTimeout(() => {
      pageTwo.close();
    }, 500);
  };

  return (
    <>
      <dialog 
        style={styles}
        className='page-1 text-center bg-green-50 rounded-xl 
        shadow-lg border-4 border-green-600'
      >
        <p className='font-bold'>
          You have 6 chances to guess the 5 letter word, your goal is to guess the word in the least amount of tries.
        </p>
        <button 
          className='text-md w-4/6 mt-8 mb-4 rounded-lg border-2 bg-green-600 border-yellow-900 
          font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
          onClick={showPageTwoOfHowTo}
        >
            Next
        </button>
      </dialog>
      <dialog 
        style={styles}
        className='page-2 text-center bg-green-50 rounded-xl 
        shadow-lg border-4 border-green-600'
      >
        <p className='mb-2 text-md font-bold'>
          Letter backgrounds in game will change color depending on their state:
        </p>
        <ul 
          style={darkDialog}
          className='flex flex-col gap-4 mt-4 mb-2 shadow-lg border-2 
          border-green-600 p-2 rounded-md '
        >
          <li className='flex gap-2 items-center text-left'>
            <div className='h-4 w-4 bg-yellow-800'></div>
            <p>Letter is not in the word</p>
          </li>
          <li className='flex gap-2 items-center text-left'>
            <div className='h-4 w-4 bg-yellow-300 flex-shrink-0'></div>
            <p>Letter is in the word, but in the wrong position</p>
          </li>
          <li className='flex gap-2 items-center text-left'>
            <div className='h-4 w-4 bg-green-600'></div>
            <p>Letter is in the right position</p>
          </li>
        </ul>
        <button 
          className='text-md w-4/6 mt-4 rounded-lg border-2 bg-green-600 border-yellow-900 
          font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
          onClick={closeHowTo}>
            Got it!
        </button>
      </dialog>
    </>
  )
}
