import React from 'react';
import logo from '../Assets/Pictures/turd.png'
import { useTheme } from '../ThemeContext';

export default function WelcomePage( { setUser, openHowTo, closeMenu, openSignUp, openSignIn } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  function changeUserState(user) {
    if (user === 'guest') setUser('guest');

    //
    //
  }

    

  return (
    <>
      <div 
        onClick={closeMenu}
        style={styles} 
        className="welcome-page w-screen flex-grow flex items-center justify-center"
      >
        <div className='welcome-container flex flex-col items-center font-quicksand gap-4 pb-20'>
          <div className='header flex items-center'>
            <img src={logo} alt="logo" className='h-12 -rotate-12 mr-1'/>
            <h1 className='font-pen text-9xl text-center mb-2'>TURDLE</h1>
            <img src={logo} alt="logo" className='h-12 rotate-12 ml-3'/>
          </div>
          <button 
            onClick={openSignIn}
            className='text-md w-4/6 mt-6 mb-6 pt-4 pb-4 rounded-lg border-2
            border-gray-800 bg-green-600 font-bold text-2xl text-gray-50
            hover:text-green-600 hover:bg-gray-50'>
              Sign In
          </button>
          <div className='w-full flex flex-col items-center'>
            <p className='text-xl pb-1'>
              Don't have an account?  
            </p>
            <button 
              onClick={openSignUp}
              className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-green-600 
              border-gray-800 font-bold text-2xl text-gray-50 hover:text-green-600 hover:bg-gray-50'>
                Sign Up
            </button>
            <p 
              className='text-xl mt-2 mb-2'
            >
              <em>or</em>
            </p>
            <button 
              className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-green-600 
              border-gray-800 font-bold text-2xl text-gray-50 hover:text-green-600 hover:bg-gray-50'
              onClick={() => changeUserState('guest')}>
                Continue as Guest
            </button>
          </div>
          <button 
              onClick={openHowTo} 
              className='text-md w-4/6 pt-1 pb-1 rounded-lg border-2 bg-yellow-400 
              border-gray-800 font-bold text-2xl text-gray-50 hover:text-yellow-400 hover:bg-gray-50'>
                How To Play
          </button>
        </div>
      </div>
    </>
    
  );
};
