import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import imgPowerUp1 from './img/powerUp1.png';
import imgPowerUp2 from './img/powerUp2.png';
import imgPowerUp3 from './img/powerUp3.png';

export const Game = () => {
  const inputRefs = useRef([]);
  const [value, setValue] = useState('');
  const [meaning, setMeaning] = useState('');
  const [word, setWord] = useState([]);
  const [letterHints, setLetterHints] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitted2, setSubmitted2] = useState(false);
  const [submitted3, setSubmitted3] = useState(false);
  const [submitted4, setSubmitted4] = useState(false);
  const [submitted5, setSubmitted5] = useState(false);
  const [isSubmitVisible, setSubmitVisible] = useState(false);
  const [submittedWord, setSubmittedWord] = useState([]);
  const [submittedWord2, setSubmittedWord2] = useState([]);
  const [submittedWord3, setSubmittedWord3] = useState([]);
  const [submittedWord4, setSubmittedWord4] = useState([]);
  const [submittedWord5, setSubmittedWord5] = useState([]);
  const [timesSubmitted, setTimesSubmitted] = useState(0);
  const [letterColor, setLetterColor] = useState([]); 
  const [isWordGuessed, setIsWordGuessed] = useState(null);
  const [hp, sethp] = useState(() => {
    const savedHp = localStorage.getItem('hp');
    return savedHp ? parseInt(savedHp, 10) : 3;
  });
  const [exp, setExp] = useState(() => {
    const savedExp = localStorage.getItem('exp');
    return savedExp ? parseInt(savedExp, 10) : 0;
  }); 
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  }); 
  const [wordTileNumber, setWordTileNumber] = useState(() => {
    const savedWordTileNumber = localStorage.getItem('wordTileNumber');
    return savedWordTileNumber ? parseInt(savedWordTileNumber, 10) : 5;
  });
  const [isNextWordVisible, setIsNextWordVisible] = useState(false);
  const [hintValue1, setHintValue1] = useState(0);
  const [hintValue2, setHintValue2] = useState(Math.floor(Math.random() * wordTileNumber));
  const [powerUp2, setPowerUp2] = useState(
    localStorage.getItem('powerUp2') === 'true'
  );
  const [powerUp3, setPowerUp3] = useState(
    localStorage.getItem('powerUp3') === 'true'
  );
  const [expThreshold, setExpThreshold] = useState(() => {
    const savedExpThreshold = localStorage.getItem('expThreshold');
    return savedExpThreshold ? parseInt(savedExpThreshold, 10) : 100;
  });
  const [tries, setTries] = useState(() => {
    const savedTries = localStorage.getItem('tries');
    return savedTries ? parseInt(savedTries, 10) : 4;
  })

  useEffect(() => {
    if(hintValue1 === hintValue2) {
      setHintValue2(Math.floor(Math.random() * wordTileNumber))
    }
  },[])

  useEffect(() => {
    // Focus on the first input when the component mounts
    inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await axios.get(`https://random-word-api.vercel.app/api?words=1&length=${wordTileNumber}`);
        const randomWord = response.data[0];
        setValue(randomWord)
      } catch (error) {
        console.error('Error fetching random word', error);
      }
    };
    fetchRandomWord();
  },[])
 
  useEffect(() => {
    localStorage.setItem('exp', exp);
  }, [exp]);
  useEffect(() => {
    localStorage.setItem('hp', hp);
  }, [hp]);
  useEffect(() => {
    localStorage.setItem('points', points);
  }, [points]);
  useEffect(() => {
    localStorage.setItem('wordTileNumber', wordTileNumber);
  }, [wordTileNumber]);
  useEffect(() => {
    localStorage.setItem('powerUp2', powerUp2)
  },[powerUp2])
  useEffect(() => {
    localStorage.setItem('powerUp3', powerUp3)
  },[powerUp3])
  useEffect(() => {
    localStorage.setItem('expThreshold', expThreshold)
  },[expThreshold]);
  useEffect(() => {
    localStorage.setItem('tries', tries)
  },[tries]);

  /*
  useEffect(() => {
    if (word.length === 5) {
      setSubmitVisible(true);
    } else if (word.length < 5) {
      setSubmitVisible(false);
    }
  }, [word]);
  */

  const fetchRandomWordMeaning = async () => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${value}`);
      const wordMeaning = response.data[0]['meanings'][0]['definitions'][0]['definition'];
      setMeaning(wordMeaning)
    } catch (error) {
      console.error('Error fetching random word', error);
    }
  };

  const handleInputChange = (index, event) => {
    const inputValue = event.target.value;
    const updatedWord = [...word];

    if(index >= 0 && index < inputRefs.current.length) {
       // Update the word array at the correct index
       updatedWord[index] = inputValue;
       // Set the updated word state
       setWord(updatedWord);
    }

    // Set focus to the next input if there is one
    if(inputValue.length === 1 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus();
    }

    // Check if all input boxes are filled to show the submit button
    const filledBoxes = updatedWord.filter(letter => typeof letter === 'string' && letter.trim() !== '');
    setSubmitVisible(filledBoxes.length === wordTileNumber);

    /*
    const inputLength = event.target.value.length;

    if (inputLength === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
      setWord(prevWord => [...prevWord, event.target.value]);
    }
    if (inputLength > 0 && index === inputRefs.current.length - 1) {
      setWord(prevWord => [...prevWord,event.target.value]);
    }
    if (inputLength === 0 && index > 0) {
      inputRefs.current[index].focus();
      setWord(prevWord => prevWord.slice(0, -1));
    } else if (inputLength === 0 && index === 0) {
      setWord([]);
    }
    */  
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && index > 0 && !inputRefs.current[index].value) {
      inputRefs.current[index - 1].focus();
    } else if(event.key === 'Enter' && word.length === wordTileNumber && isWordGuessed === null) {
      handleSubmit();
    } else if(event.key === 'Enter' && isWordGuessed === true) {
      handleNext();
    } else if(event.key === 'Enter' && isWordGuessed === false && hp !== 0) {
      handleRetry();
    } 
  };
  
  const handleSubmit = () => {  
    let hints = []; 
    for(let i = 0; i < word.length; i++) {
      let doesNotExist = 0; 
      for(let j = 0; j < value.length; j++) {
        if(word[i] === value[j] && i === j) {
          hints.push('Exact Place')
          break;
        } else if (word[i] === value[j] && i !== j) {
          hints.push('Not Exact Place');
        } else if (word[i] !== value[j]) { 
          doesNotExist++;
        }
      } 
      if (doesNotExist === wordTileNumber) {
        hints.push('Does not exist')
      }
    }
      console.log(value)
      console.log(hints)
      console.log(word)

    let exact = 0;
    for (let i = 0; i < hints.length; i++) {
      if(hints[i] === 'Exact Place') {
        exact++;
        setLetterColor(prevLetterColor => [...prevLetterColor, 'Yellow'])
      } else if (hints[i] === 'Does not exist') {
        setLetterColor(prevLetterColor => [...prevLetterColor, 'Red'])
      } else if (hints[i] === 'Not Exact Place') {
        setLetterColor(prevLetterColor => [...prevLetterColor, 'Orange'])
      }
    }
    if (exact === wordTileNumber) {
      if(timesSubmitted === 0) {
        setPoints(points + 1000);
      } else if (timesSubmitted === 1) {
        setPoints(points + 500);
      } else if (timesSubmitted === 2) {
        setPoints(points + 250);
      } else if(timesSubmitted === 3) {
        setPoints(points + 100);
      } else if(timesSubmitted === 4) {
        setPoints(points + 50);
      }
      setIsWordGuessed(true);
      setExp(exp + 50);
      setSubmitVisible(false);
      setIsNextWordVisible(true);
    } else if (!powerUp3 && submitted3 && exact !== wordTileNumber){
      setSubmitVisible(false);
      setIsNextWordVisible(true);
      setIsWordGuessed(false); 
      sethp(hp - 1);
    } else if (powerUp3 && submitted3 && submitted4 && exact !== wordTileNumber) {
      setSubmitVisible(false);
      setIsNextWordVisible(true);
      setIsWordGuessed(false); 
      sethp(hp - 1);
    }
     
    if(timesSubmitted === 0) {
      setLetterHints(hints);
      setSubmittedWord(word); 
      setSubmitted(true);
      fetchRandomWordMeaning();
      setTimesSubmitted(timesSubmitted + 1);
      setTries(tries - 1);
    } else if (timesSubmitted === 1) {
      setSubmittedWord2(word)
      setSubmitted2(true);
      setTimesSubmitted(timesSubmitted + 1);
      setTries(tries - 1);
    }  else if (timesSubmitted === 2) {
      setSubmittedWord3(word)
      setSubmitted3(true);
      setTimesSubmitted(timesSubmitted + 1);
      setTries(tries - 1);
    }  else if (timesSubmitted === 3) {
      setSubmittedWord4(word)
      setSubmitted4(true);
      setTimesSubmitted(timesSubmitted + 1);
      setTries(tries - 1);
    } else if (timesSubmitted === 4 && powerUp3) {
      setSubmittedWord5(word);
      setSubmitted5(true);
      setTries(tries - 1);
    }
  }

  const handleNext = () => {
    if(powerUp3) {
      setTries(5);
    } else {
      setTries(4);
    }
    window.location.reload();
  }

  const handleRetry = () => {
    if(powerUp3) {
      setTries(5);
    } else {
      setTries(4);
    }
    window.location.reload();
  }

  const handleGameOver = () => {
    sethp(3);
    setExp(0);
    setPoints(0);
    setPowerUp2(false);
    setPowerUp3(false);
    setWordTileNumber(5);
    setExpThreshold(100);
    setTries(4);
    window.location.reload();
  }
  
  const handlePowerUp1 = () => {
    setExp(0);
    setWordTileNumber(4);
    setExpThreshold(expThreshold + 200);
    window.location.reload();
  }
  const handlePowerUp2 = () => {
    setExp(0);
    setPowerUp2(true);
    setExpThreshold(expThreshold + 200);
    window.location.reload();
  }
  const handlePowerUp3 = () => {
    setExp(0);
    setPowerUp3(true);
    setExpThreshold(expThreshold + 200);
    setTries(5);
    window.location.reload();
  }

  return (
    <div className="container">
      <div className="info">
        <h1>HP: {hp}</h1>
        <h1>Points: {points}</h1>
        <h1>EXP: {exp}</h1>
        <h1 style={{fontSize: '20px'}}>You earn 50 exp every correct guess. Reach {expThreshold} exp to Level up!</h1>
      </div>
      {exp === expThreshold && (
        <div className="powerups modal">
          <div className="powerup">
            <h1>Power Up 1</h1>
            <p>Reduce Word Tile by 1</p>
            <img className="imgPowerUp" src={imgPowerUp1} alt='imgPowerUp1'/>
            <button onClick={handlePowerUp1}>Pick</button>
          </div>
          <div className="powerup">
            <h1>Power Up 2</h1>
            <p>Unlock another hint</p>
            <img className="imgPowerUp" src={imgPowerUp2} alt='imgPowerUp2'/>
            <button onClick={handlePowerUp2}>Pick</button>
          </div>
          <div className="powerup">
            <h1>Power Up 3</h1>
            <p>Increase number of tries by 1</p>
            <img className="imgPowerUp" src={imgPowerUp3} alt='imgPowerUp2'/>
            <button onClick={handlePowerUp3}>Pick</button>
          </div>
        </div>
      )}
      <h1 className="hint">Tries: {tries} </h1>
      <div className="hintsContainer">
        <h1 className="hint">{meaning ? `Hint: ${meaning}` : `1st Letter Hint: ${value[hintValue1]}`}</h1>
        {powerUp2 && (
           <h1 className="hint">{meaning ? `` : `2nd Letter Hint: ${value[hintValue2]}`}</h1>
        )}
      </div>    
      <h1 className="guess-the-word">Guess the word:</h1>
      {submitted && (
        <div className="word-container">
            {submittedWord.map((letter, index) => {
              return <h1 key={index} className="result" style={{color: letterColor[index]}}>{letter}</h1>
            })}
        </div>
     )}
     {submitted2 && (
        <div className="word-container">
            {submittedWord2.map((letter, index) => {
              return <h1 key={index} className="result"  style={{color: letterColor[index + wordTileNumber]}}>{letter}</h1>
            })}
        </div>
     )}
     {submitted3 && (
        <div className="word-container">
            {submittedWord3.map((letter, index) => {
              return <h1 key={index} className="result"  style={{color: letterColor[index + (wordTileNumber * 2)]}}>{letter}</h1>
            })}
        </div>
     )}
     {submitted4 && (
        <div className="word-container">
            {submittedWord4.map((letter, index) => {
              return <h1 key={index} className="result"  style={{color: letterColor[index + (wordTileNumber * 3)]}}>{letter}</h1>
            })}
        </div>
     )}
     {submitted5 && (
        <div className="word-container">
            {submittedWord5.map((letter, index) => {
              return <h1 key={index} className="result"  style={{color: letterColor[index + (wordTileNumber * 4)]}}>{letter}</h1>
            })}
        </div>
     )}
      <div className="box-container">
        {[...Array(wordTileNumber)].map((_, index) => (
          <input 
            ref={(el) => (inputRefs.current[index] = el)} 
            onChange={(event) => handleInputChange(index, event)} 
            onKeyDown={(event) => handleKeyDown(index, event)} 
            id="input-box" 
            type="text"
            maxLength={1}
          >
          </input>
        ))}
      </div>
      {isSubmitVisible && (
        <button className="button submit" onClick={handleSubmit}>Submit</button>
      )}
      {isNextWordVisible && isWordGuessed && (
        <button className="button submit" onClick={handleNext}>Next</button>
      )}
      {isNextWordVisible && isWordGuessed === false && hp !== 0 && (
        <button className="button submit" onClick={handleRetry}>Retry</button>
      )}
      {hp === 0 && (
        <div className="game-over modal"> 
            <h1>GAME OVER NA BORDS</h1>
            <h1>Score: {points}</h1>
            <button className="button" onClick={handleGameOver}>BALIK SUGOD BORDS</button>
        </div>
      )}
      {isWordGuessed && (
        <h1 className="win-or-lose">Chamba rana bords</h1>
      )}  
      {isWordGuessed === false && (
        <h1 className="win-or-lose">Bruh... Ang word kay '{value}' </h1>
      )}  

    </div>
  )
} 