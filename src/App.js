import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StartScreen } from './startscreen';
import { Game } from './game';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<StartScreen />} />
          <Route path="/game" exact element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
