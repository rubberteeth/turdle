import React from 'react'
import { useTheme } from '../ThemeContext'





export default function SignUp( { closeSignUp } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  return (
    <dialog 
        style={styles}
        className='sign-up text-center text-2xl bg-green-50 rounded-xl 
        shadow-lg border-4 border-gray-800 w-full p-8'
      >
        <form action="#">
          <label 
            htmlFor="email"
            className='flex items-center justify-between gap-4 my-4 flex-wrap'
          >
            
            Email:

            <input 
              className='border-2 border-slate-500 h-10 rounded-md pl-2 w-full'
              type="text" 
              id='email' 
              required
            />
          </label>
          <label 
            className='flex items-center justify-between gap-4 my-4 flex-wrap'
            htmlFor="password"
          >
            Password:
            <input 
              className='border-2 border-slate-500 h-10 rounded-md pl-2 w-full'
              type="password" 
              id='password' 
              required
            />
          </label>
          <button 
            className='text-md w-4/6 mt-8 mb-4 rounded-lg border-2 bg-green-600 border-gray-800 
            pt-2 pb-2 font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
          >
              Sign Up!
          </button>
        </form>
        <button
          onClick={closeSignUp}
          className='text-md w-4/6 mt-2 mb-4 rounded-lg border-2 bg-slate-400 border-gray-800 
          pt-2 pb-2 font-bold text-gray-50 hover:text-slate-400 hover:bg-gray-50'
        >
          Close
        </button>
      </dialog>
  )
}
