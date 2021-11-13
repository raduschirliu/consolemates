import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Router>
        {/* Router example */}
        {/* <Routes>
          <Route path="/some-path" component={} exact />
        </Routes> */}

        <p>Hackathon template</p>
      </Router>
    </div>
  );
};

export default App;
