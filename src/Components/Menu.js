import React from 'react'
import { useTheme, useThemeUpdate } from '../ThemeContext';

export default function Menu( { 
  user, 
  signOutUser, 
  openHowTo, 
  closeMenu, 
  openStatistics,
  updateStatisticsData } ) {

  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();

  const styles = {
    backgroundColor : darkTheme ? 'rgb(75, 85, 99)' : 'rgb(220, 220, 220)',
    color: darkTheme ? '#eee' : '#050505',
  };

  const buttonStyles = {
    borderColor: darkTheme ? '#e5e7eb' : '#323232',
    color: darkTheme ? '#fefefe' : '#050505',
    padding: '5px',
  };


  function toggleStorageDarkTheme() {
    let data = JSON.parse(localStorage.getItem('turdle-theme'));
    data = !darkTheme;
    localStorage.setItem('turdle-theme', JSON.stringify(data));
  }


  return (
    <nav 
      style={styles}
      className='menu bg-gray-300 absolute top-0 right-0 w-2/5 h-screen z-30 
      translate-x-full font-cinzel'
    >
      <div 
        className='flex justify-center m-2 absolute w-6 h-6 top-0 right-0 cursor-pointer'
        onClick={closeMenu}
      >
        <div className='w-0.5 h-full bg-black rotate-45 absolute '></div>
        <div className='w-0.5 h-full bg-black -rotate-45 absolute'></div>
      </div> 

      {user && <p className='m-4 text-center text-2xl'>Hello {user}!</p>}
      
      <ul className='w-full mt-16 p-6 flex flex-col gap-4'>

        <li className='flex w-full'>
          <label className='switch w-full flex items-center' htmlFor="darkmode"> 
            <p className='text-xl'>Dark Mode</p>
            <input type="checkbox" name='darkmode' id='darkmode' checked={darkTheme}
              onChange={() => {
                toggleStorageDarkTheme();
                toggleTheme();
                }}/>
            <span className='slider round'></span>
          </label>
        </li>

        <li>
          <button
            style={buttonStyles}
            onClick={() => {
              closeMenu();
              openHowTo();
            }}
            className='border-2 rounded-md w-full bg-gray-400 hover:scale-105'
          >
            How To Play
          </button>
        </li>

        <li>
          <button
            style={buttonStyles}
            onClick={() => {
              updateStatisticsData()
              closeMenu();
              openStatistics();
            }}
            className='border-2 rounded-md w-full bg-gray-400 hover:scale-105'
          >
            My Stats
          </button>  
        </li>  




        <li className='flex justify-center'>
          <button 
            style={buttonStyles}
            onClick={() => {
              signOutUser();
              closeMenu();
            }}
            className='border-2 rounded-md w-full bg-gray-400 hover:scale-105'
          >
            Sign Out
          </button>
        </li>
      </ul>


    </nav>
  )
}
