import React, { useRef } from 'react'
import { useTheme } from '../ThemeContext'


export default function SignUp( { closeSignUp, createUser } ) {

  const darkTheme = useTheme()
  const emailRef = useRef()
  const passwordRef = useRef()
  const warningRef = useRef()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  function emailInputChange() {
    if (emailRef.current.checkValidity()) {
      warningRef.current.className = '';
      warningRef.current.textContent = '';
    }
  }

  function passwordInputChange() {
    if (passwordRef.current.checkValidity()) {
      warningRef.current.className = '';
      warningRef.current.textContent = '';
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if(!emailRef.current.checkValidity()) {
      warningRef.current.className = 'font-bold bg-pink-200 rounded-md border-red-500 text-red-500 p-4';
      warningRef.current.textContent = 'Invalid email address';
      return 
    } else if (!passwordRef.current.checkValidity()) {
      warningRef.current.className = 'font-bold bg-pink-200 rounded-md border-red-500 text-red-500 p-4';
      warningRef.current.textContent = 'Password must be between 6 and 20 characters'
      return
    }
    createUser(emailRef.current.value, passwordRef.current.value)
  }

  return (
    <dialog 
        style={styles}
        className='sign-up font-quicksand text-center text-2xl bg-green-50 rounded-xl 
        shadow-lg border-4 border-gray-800 w-full p-8 h-max'
      >
        <p className='font-bold text-3xl pb-4'>Create New Account</p>
        <p ref={warningRef}></p>
        <form action="#">
          <label 
            
            htmlFor="sign-up-email"
            className='flex flex-col items-start gap-4 my-4 font-bold'
          >
            
            Email:

            <input 
              onChange={emailInputChange}
              ref={emailRef}
              className='border-2 border-slate-500 h-10 rounded-md pl-2 w-full text-slate-600
              invalid:border-pink-500 invalid:text-pink-600
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500'
              type="email" 
              id='sign-up-email' 
              required
            />
          </label>
          <label 
            className='flex flex-col items-start gap-4 my-4 font-bold'
            htmlFor="sign-up-password"
          >
            Password:
            <input 
              onChange={passwordInputChange}
              ref={passwordRef}
              className='border-2 border-slate-500 h-10 rounded-md pl-2 w-full text-slate-600
              invalid:border-pink-500 invalid:text-pink-600
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500'
              minLength={6}
              maxLength={16}
              type="password" 
              id='sign-up-password' 
              required
            />
          </label>
          <button 
            type='submit'
            onClick={handleSubmit}
            className='text-md w-4/6 mt-8 mb-4 rounded-lg border-2 bg-green-600 border-gray-800 
            pt-2 pb-2 font-bold text-gray-50 hover:text-green-600 hover:bg-gray-50'
          >
              Sign Up!
          </button>
        </form>
        <button
          onClick={() => {
            warningRef.current.className = '';
            warningRef.current.textContent = '';
            closeSignUp()
          }}
          className='text-md w-4/6 mt-2 mb-4 rounded-lg border-2 bg-slate-400 border-gray-800 
          pt-2 pb-2 font-bold text-gray-50 hover:text-slate-400 hover:bg-gray-50'
        >
          Close
        </button>
      </dialog>
  )
}
