/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const jiradepsJiraCall = /* GraphQL */ `
  query JiradepsJiraCall($url: String, $user: String, $password: String) {
    jiradepsJiraCall(url: $url, user: $user, password: $password)
  }
`;
export const getIssue = /* GraphQL */ `
  query GetIssue($id: ID!) {
    getIssue(id: $id) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const listIssues = /* GraphQL */ `
  query ListIssues(
    $filter: ModelIssueFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIssues(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
