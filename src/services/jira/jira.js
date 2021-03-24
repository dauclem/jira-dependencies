import { API } from 'aws-amplify';
import { graphqlOperation } from "@aws-amplify/api-graphql";
import { jiradepsJiraCall } from '../../graphql/queries';

const apiPath = {
    default: '/rest/api/latest',
    agile: '/rest/agile/1.0',
};

const getBoardIssues = async (host, user, password, boardId) => {
    const issues = await API.graphql(graphqlOperation(jiradepsJiraCall, {
        url: `${host}${apiPath.agile}/board/${boardId}/issue`,
        user,
        password,
    }))
    .then(result => JSON.parse(result.data.jiradepsJiraCall).issues)
    .catch(error => console.log(error));

    return issues ?? [];
};

export default getBoardIssues;
