import React, { useEffect } from 'react';
import './App.css';
import { Auth, Hub } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifySignIn } from '@aws-amplify/ui-react';
import { BoardForm } from './components/Board/BoardForm/BoardForm';

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
    <div className="App">
      <BoardForm/>
      <AmplifySignOut />
    </div>
  );
}

export default App;
