import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import monitorImage from 'src/assets/monitor.png';
import logoImage from 'src/assets/logo.png';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-title-container">
        <p className="home-title">ConsoleMates</p>
        <img className="home-logo" src={logoImage} alt="logo" />
      </div>
      <div
        className="home-monitor"
        style={{ backgroundImage: `url(${monitorImage})` }}
      >
        <p className="text-md lg:text-lg xl:text-xl home-text">
          Welcome to ConsoleMates!
          <br /> <br />
          This is a place where computer science students, software engineers,
          and any coder in between can let out their feelings and connect with
          others anonymously. Connections are matched based on topic preference
          so you get someone who can relate, but connections are 1-time so you
          can truly feel free to speak (or type) your mind.
          <br /> <br />
          Get started below :)
          <br />
          <span className="text-xs">
            (Currently, ConsoleMates only works on desktop devices.)
          </span>
        </p>

        <Button
          className="home-button"
          component={Link}
          to="/terminal"
          variant="outlined"
        >
          Login
        </Button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default HomePage;
