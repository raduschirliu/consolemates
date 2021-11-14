import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Link to="/app">GUI</Link>
      <br />
      <Link to="/terminal">Terminal</Link>
    </div>
  );
};

export default HomePage;
