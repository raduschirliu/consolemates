import { withAuthenticationRequired } from '@auth0/auth0-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LetterProvider } from '../../contexts/LetterContext';
import AppPage from '../../pages/AppPage';
import HomePage from '../../pages/HomePage';
import './App.css';

const GuardedRoute = ({ component, ...rest }: any) => {
  return <Route component={withAuthenticationRequired(component)} {...rest} />;
};

const App = () => {
  return (
    <div className="app-container">
      <LetterProvider>
        <Router>
          <Switch>
            <GuardedRoute path="/app" component={AppPage} />
            <Route path="/" component={HomePage} exact />
          </Switch>
        </Router>
      </LetterProvider>
    </div>
  );
};

export default App;
