import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { createBoard as createBoardMutation } from '../../../graphql/mutations';

const initialFormState = { host: '', user: '', password: '', jiraBoardId: 0 }

export const BoardForm = () => {

    const [formData, setFormData] = useState(initialFormState);

    async function createBoard() {
        if (!formData.host || !formData.user || !formData.password || !formData.jiraBoardId) return;
        await API.graphql({ query: createBoardMutation, variables: { input: formData } });
        setFormData(initialFormState);
    }

    return (
        <>
            <h2>Create board</h2>
            <input
                onChange={e => setFormData({ ...formData, 'host': e.target.value.trim('/')})}
                placeholder="https://myjira.atlassian.net"
                value={formData.host}
                type="text"
            />
            <input
                onChange={e => setFormData({ ...formData, 'user': e.target.value})}
                placeholder="myemail@domain.com"
                value={formData.user}
                type="email"
            />
            <input
                onChange={e => setFormData({ ...formData, 'password': e.target.value})}
                placeholder="password"
                value={formData.password}
                type="password"
            />
            <input
                onChange={e => setFormData({ ...formData, 'jiraBoardId': e.target.value})}
                placeholder="123"
                value={formData.jiraBoardId}
                type="number"
            />
            <button onClick={createBoard}>Create board</button>
        </>
    );
};
  