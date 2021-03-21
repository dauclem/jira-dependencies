import { API } from 'aws-amplify';
import { graphqlOperation } from "@aws-amplify/api-graphql";
import { jiradepsJiraCall } from '../../graphql/queries';

const jiraConfiguration = {
    protocol: 'https',
    host: '***.atlassian.net',
    user: '***@***',
    password: '****',
    boardId: 1,
};
const apiPath = {
    default: '/rest/api/latest',
    agile: '/rest/agile/1.0',
};

export const getBoardIssue = async () => {
    const issues = await API.graphql(graphqlOperation(jiradepsJiraCall, {
        url: `${jiraConfiguration.protocol}://${jiraConfiguration.host}${apiPath.agile}/board/${jiraConfiguration.boardId}/issue`,
        user: jiraConfiguration.user,
        password: jiraConfiguration.password,
    }))
    .then(result => {
        return JSON.parse(result.data.jiradepsJiraCall).issues;
    })
    .catch(error => console.log(error));

    console.log(issues);
};

export default getBoardIssue;
