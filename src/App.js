import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listIssues } from './graphql/queries';
import { createIssue as createIssueMutation, deleteIssue as deleteIssueMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {
  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchIssues();
  }, []);

  async function fetchIssues() {
    const apiData = await API.graphql({ query: listIssues });
    setIssues(apiData.data.listIssues.items);
  }

  async function createIssue() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createIssueMutation, variables: { input: formData } });
    setIssues([ ...issues, formData ]);
    setFormData(initialFormState);
  }

  async function deleteIssue({ id }) {
    const newIssuesArray = issues.filter(issue => issue.id !== id);
    setIssues(newIssuesArray);
    await API.graphql({ query: deleteIssueMutation, variables: { input: { id } }});
  }

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
      <button onClick={createIssue}>Create Issue</button>
      <div style={{marginBottom: 30}}>
        {
          issues.map(issue => (
            <div key={issue.id || issue.name}>
              <h2>{issue.name}</h2>
              <p>{issue.description}</p>
              <button onClick={() => deleteIssue(issue)}>Delete issue</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);