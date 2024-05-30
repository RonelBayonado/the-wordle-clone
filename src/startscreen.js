import React from 'react';
import { Link } from 'react-router-dom';

export const StartScreen = () => {
  return (
    <div className='welcomeContainer'>
        <h1 className='welcome'>The Wordle Clone</h1>
        <h1 className='author'>by Ronel Gwapo</h1>
        <Link to='/game'>
          <button className='start button'>Start</button>
        </Link> 
    </div>
  )
}