import { withAuthenticationRequired } from '@auth0/auth0-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LetterProvider } from '../../contexts/LetterContext';
import 'tailwindcss/tailwind.css';
import AppPage from '../../pages/AppPage';
import HomePage from '../../pages/HomePage';
import TerminalPage from '../../pages/TerminalPage';
import UserPage from '../../pages/UserPage';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const MuiTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "'Source Code Pro', monospace",
    },
  },
  palette: {
    primary: {
      main: '#00BE68',
    },
  },
});

const GuardedRoute = ({ component, ...rest }: any) => {
  return <Route component={withAuthenticationRequired(component)} {...rest} />;
};

const App = () => {
  return (
    <div className="app-container">
      <LetterProvider>
        <ThemeProvider theme={MuiTheme}>
          <Router>
            <Switch>
              <GuardedRoute path="/app" component={AppPage} />
              <GuardedRoute path="/user" component={UserPage} />
              <GuardedRoute path="/terminal" component={TerminalPage} />
              <Route path="/" component={HomePage} exact />
            </Switch>
          </Router>
        </ThemeProvider>
      </LetterProvider>
    </div>
  );
};

export default App;
