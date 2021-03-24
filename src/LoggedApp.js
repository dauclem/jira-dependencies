import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import './App.css';

import { BoardForm } from './components/Board/BoardForm/BoardForm';

import NotFound from './pages/404';

function LoggedApp() {
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
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default LoggedApp;
