import React from 'react';
import logo from '../Assets/Pictures/turd.png'

export default function WelcomePage() {

  function openHowTo() {
    const dialog = document.querySelector('.page-1');
    dialog.show();
    dialog.classList.add('show');
  };

  function showPageTwoOfHowTo() {
    const dialog = document.querySelector('.page-1');
    dialog.close()
    dialog.classList.remove('show')
    const pageTwo = document.querySelector('.page-2');
    pageTwo.show();
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
    <div className='welcome-page flex flex-col items-center font-quicksand gap-4 pb-4'>
      <div className='flex items-center'>
        <img src={logo} alt="logo" className='h-12 -rotate-12'/>
        <h1 className='font-pen text-6xl text-center mt-2 mb-2 '>TURDLE</h1>
      </div>
        <dialog className='page-1 mt-4 text-center bg-green-50 rounded-md shadow-lg border-2'>
          <p className='font-bold'>
            Goal: guess the word in the least amount of guesses
          </p>
          <button 
            className='text-md w-4/6 mt-8 mb-4 rounded-lg border-2 bg-green-400 font-bold text-gray-50 hover:text-green-400 hover:bg-gray-50'
            onClick={showPageTwoOfHowTo}
          >
              Next
          </button>
        </dialog>
        <dialog className='page-2 text-center bg-green-50 rounded-md shadow-lg border-2'>
          <p className='mb-2 text-md font-bold'>
            Letter backgrounds in game will change color depending on their state:
          </p>
          <ul className='flex flex-col gap-4 mt-4 mb-2 shadow-lg border-2 border-green-300 p-2 rounded-md'>
            <li className='flex gap-2 items-center text-left'>
              <div className='h-4 w-4 bg-gray-400'></div>
              <p>Letter isn't in the word</p>
            </li>
            <li className='flex gap-2 items-center text-left'>
              <div className='h-4 w-4 bg-yellow-400 flex-shrink-0'></div>
              <p>Letter is in the wrong position</p>
            </li>
            <li className='flex gap-2 items-center text-left'>
              <div className='h-4 w-4 bg-green-600'></div>
              <p>Letter is in the right position</p>
            </li>
          </ul>
          <button 
            className='text-md w-4/6 mt-4 rounded-lg border-2 bg-green-400 font-bold text-gray-50 hover:text-green-400 hover:bg-gray-50'
            onClick={closeHowTo}>
              Got it!
          </button>
        </dialog>
      <button 
        className='text-md w-4/6 mt-6 mb-6 pt-2 pb-2 rounded-lg border-2 bg-green-400 font-bold text-gray-50 hover:text-green-400 hover:bg-gray-50'>
          Log In
      </button>
       
      <div className='w-full flex flex-col items-center'>
        <p className=' text-xs'>
          Don't have an account?  
        </p>
        <button 
          className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-green-400 font-bold text-gray-50 hover:text-green-400 hover:bg-gray-50'>
            Sign Up
        </button>
        <p className='text-sm mt-2 mb-2'><em>or</em></p>
        <button 
          className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-green-400 font-bold text-gray-50 hover:text-green-400 hover:bg-gray-50'>
            Continue as Guest
        </button>
      </div>
      
      <button 
          onClick={openHowTo} 
          className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-yellow-400 font-bold text-gray-50 hover:text-yellow-400 hover:bg-gray-50'>
            How To Play
        </button>
    </div>
  );
};
