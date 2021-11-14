import { Link } from 'react-router-dom';
import monitorImage from 'src/assets/monitor.png';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-monitor-container">
        <div
          className="home-monitor"
          style={{ backgroundImage: `url(${monitorImage})` }}
        >
          <p className="home-text">
            Welcome to ConsoleMates!
            
            This is a place where computer science
            students, software engineers, and any coder in between can let out
            their feelings and connect with others anonymously. Connections are
            matched based on topic preference so you get someone who can relate,
            but connections are 1-time so you can truly feel free to speak (or
            type) your mind.
            
            Get started below :) hit y to login... (y/n) y
            username: user pw: ******
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
