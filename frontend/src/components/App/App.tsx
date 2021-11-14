import { withAuthenticationRequired } from '@auth0/auth0-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LetterProvider } from '../../contexts/LetterContext';
import 'tailwindcss/tailwind.css';
import AppPage from '../../pages/AppPage';
import HomePage from '../../pages/HomePage';
import TerminalPage from '../../pages/TerminalPage';
import UserPage from '../../pages/UserPage';
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
            <GuardedRoute path="/user" component={UserPage} />
            <GuardedRoute path="/terminal" component={TerminalPage} />
            <Route path="/" component={HomePage} exact />
          </Switch>
        </Router>
      </LetterProvider>
    </div>
  );
};

export default App;
