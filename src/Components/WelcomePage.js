import React from 'react';
import logo from '../Assets/Pictures/turd.png'
import { useTheme } from '../ThemeContext';
import MenuButton from './MenuButton';
import HowToPlayModal from './HowToPlayModal';

export default function WelcomePage( { setUser, openHowTo, openMenu, closeMenu } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(114, 43, 0)' : 'rgb(255, 251, 235)',
    color: darkTheme ? '#eee' : '#111',
  }

  function changeUserState(user) {
    if (user === 'guest') setUser('guest');

    //
    //
  }

  return (
    <>
      <MenuButton openMenu={openMenu}/>
      <div 
        onClick={closeMenu}
        style={styles} 
        className="welcome-page w-screen min-h-screen flex items-center justify-center"
      >
        <div className='welcome-container flex flex-col items-center font-quicksand gap-4 pb-4'>
        
          <div className='header flex items-center mt-10'>
            <img src={logo} alt="logo" className='h-12 -rotate-12 mr-1'/>
            <h1 className='font-pen text-6xl text-center mt-2 mb-2'>TURDLE</h1>
            <img src={logo} alt="logo" className='h-12 rotate-12 ml-3'/>
          </div>
          <HowToPlayModal />
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
    </>
    
  );
};
