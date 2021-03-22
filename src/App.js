import React, { useState, useEffect } from 'react';
import './App.css';
import { Auth, Hub, API, Storage } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifySignIn } from '@aws-amplify/ui-react';
import { listIssues } from './graphql/queries';
import { createIssue as createIssueMutation, deleteIssue as deleteIssueMutation } from './graphql/mutations';
import getBoardIssue from './services/jira/jira';

const initialFormState = { name: '', description: '' }

function App() {
  const [user, updateUser] = React.useState(null);
  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

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

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  async function fetchIssues() {
    const apiData = await API.graphql({ query: listIssues });
    const issuesFromAPI = apiData.data.listIssues.items;
    await Promise.all(issuesFromAPI.map(async issue => {
      if (issue.image) {
        const image = await Storage.get(issue.image);
        issue.image = image;
      }
      return issue;
    }))
    setIssues(apiData.data.listIssues.items);
  }

  async function createIssue() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createIssueMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setIssues([ ...issues, formData ]);
    setFormData(initialFormState);
  }

  async function deleteIssue({ id }) {
    const newIssuesArray = issues.filter(issue => issue.id !== id);
    setIssues(newIssuesArray);
    await API.graphql({ query: deleteIssueMutation, variables: { input: { id } }});
  }
  
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchIssues();
  }

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

  getBoardIssue();

  return (
    <div className="App">
      <h1>My Issues App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Issue name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Issue description"
        value={formData.description}
      />
      <input
        type="file"
        onChange={onChange}
      />
      <button onClick={createIssue}>Create Issue</button>
      <div style={{marginBottom: 30}}>
        {
          issues.map(issue => (
            <div key={issue.id || issue.name}>
              <h2>{issue.name}</h2>
              <p>{issue.description}</p>
              <button onClick={() => deleteIssue(issue)}>Delete issue</button>
              {issue.image && <img src={issue.image} style={{width: 400}} />}
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default App;
