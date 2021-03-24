import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import './App.css';

import { Board } from './pages/Board';
import LoggedApp from './LoggedApp';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/board/:boardId">
            <Board />
          </Route>
          <Route path="*">
            <LoggedApp />
          </Route>
        </Switch>
        <AmplifySignOut />
      </div>
    </Router>
  );
}

export default App;
