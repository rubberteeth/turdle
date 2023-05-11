import React from 'react';
import logo from '../Assets/Pictures/turd.png'
import { useTheme } from '../ThemeContext';
import MenuButton from './MenuButton';

export default function WelcomePage( { setUser, openMenu } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(114, 43, 0)' : 'rgb(255, 251, 235)',
    color: darkTheme ? '#eee' : '#111',
  }

  const darkDialog = {
    backgroundColor: darkTheme ? 'rgb(31, 41, 55)' : 'rgb(249, 250, 251)'
  }

  function openHowTo() {
    const dialog = document.querySelector('.page-1');
    dialog.showModal();
    dialog.classList.add('show');
  };

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
  

  function changeUserState(user) {
    if (user === 'guest') setUser('guest');

    //
    //
  }

  

  return (
    <div style={styles} className="welcome-page w-screen min-h-screen flex items-center justify-center">
      <div className='welcome-container flex flex-col items-center font-quicksand gap-4 pb-4'>
      <MenuButton openMenu={openMenu}/>
        <div className='header flex items-center mt-10'>
          <img src={logo} alt="logo" className='h-12 -rotate-12 mr-1'/>
          <h1 className='font-pen text-6xl text-center mt-2 mb-2'>TURDLE</h1>
          <img src={logo} alt="logo" className='h-12 rotate-12 ml-3'/>
        </div>
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
        <button 
          className='text-md w-4/6 mt-6 mb-6 pt-2 pb-2 rounded-lg border-2
          border-yellow-900 bg-green-600 font-bold text-gray-50
          hover:text-green-600 hover:bg-gray-50'>
            Sign In
        </button>
        <div className='w-full flex flex-col items-center'>
          <p className='text-xs pb-1'>
            Don't have an account?  
          </p>
          <button 
            className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-green-600 
            border-yellow-900 font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'>
              Sign Up
          </button>
          <p className='text-sm mt-2 mb-2'><em>or</em></p>
          <button 
            className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-green-600 
            border-yellow-900 font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
            onClick={() => changeUserState('guest')}>
              Continue as Guest
          </button>
        </div>
        <button 
            onClick={openHowTo} 
            className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-yellow-400 
            border-yellow-900 font-bold text-gray-50 hover:text-yellow-400 hover:bg-gray-50'>
              How To Play
        </button>
      </div>
    </div>
  );
};
