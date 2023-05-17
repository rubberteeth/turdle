import React from 'react'
import { useTheme } from '../ThemeContext'

import Keyboard from './Keyboard'

// import Words from './Words'

export default function Game( { closeMenu } ) {

  const darkTheme = useTheme()

  const styles = {
    backgroundColor : darkTheme ? 'rgb(110 125 140)' : 'rgb(245, 245, 245)',
    color: darkTheme ? '#eee' : '#111',
  }

  return (
    <div
    className='game w-screen flex-grow flex flex-col'
    style={styles}
    onClick={closeMenu}
    >
      <div
        className="game-screen w-full bg-blue-400 flex-grow"
      >

        {/* <Words /> */}


        
      </div>
      <Keyboard />
    </div>
    
  )
}
