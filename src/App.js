import React, { useEffect } from 'react';
import './App.css';
import { Auth, Hub } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifySignIn } from '@aws-amplify/ui-react';
import { Board } from './components/Board/Board';
import { BoardForm } from './components/Board/BoardForm/BoardForm';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  const [user, updateUser] = React.useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log('No signed in user.'));
    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          return updateUser(data.payload.data);
        case 'signOut':
          return updateUser(null);
        default:
      }
    });
  }, []);

  if (!user) {
    return (
      <AmplifyAuthenticator>
        <AmplifySignIn 
          slot="sign-in"
          formFields={[
            { type: "email" },
            { type: "password" },
          ]}
        />
        <AmplifySignUp
          slot="sign-up"
          formFields={[
            { type: "email" },
            { type: "password" },
          ]}
          usernameAlias="email"
        />
      </AmplifyAuthenticator>
    );
  }

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <BoardForm/>
          </Route>
          <Route path="/board/:boardId">
            <Board />
          </Route>
        </Switch>
        <AmplifySignOut />
      </div>
    </Router>
  );
}

export default App;
