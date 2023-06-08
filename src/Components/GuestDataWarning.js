import React from 'react'
import { useTheme } from '../ThemeContext'

export default function DataWarning( { setUser, closeDataWarning, resetGameData } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  return (
    <dialog 
        style={styles}
        className='data-warning text-center text-2xl bg-green-50 rounded-xl 
        shadow-lg border-4 border-gray-800 w-full p-8'
      >
        <p className='font-bold py-10'>
          Without an account, some game data may be lost, and player statistics may have inaccuracies.
        </p>
        <button 
          className='text-md w-4/6 mt-8 mb-4 rounded-lg border-2 bg-green-600 border-gray-800 
          pt-2 pb-2 font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
          onClick={() => {
            setUser('guest');
            resetGameData()
            let storage = JSON.parse(localStorage.getItem('turdle-data-key'))
            storage.username = 'guest'
            localStorage.setItem('turdle-data-key', JSON.stringify(storage))
            closeDataWarning();
          }}
        >
            Continue ?
        </button>
        <button 
          className='text-md w-4/6 mt-2 mb-4 rounded-lg border-2 bg-slate-400 border-gray-800 
          pt-2 pb-2 font-bold text-gray-50 hover:text-slate-400 hover:bg-gray-50'
          onClick={() => {
            closeDataWarning();
          }}
        >
            Cancel
        </button>

      </dialog>
  )
}
