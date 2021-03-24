import API, { graphqlOperation } from '@aws-amplify/api';
import { useEffect, useState } from 'react';
import { Route, useParams } from 'react-router-dom'
import { getBoard } from '../graphql/queries';
import getBoardIssues from '../services/jira/jira';
import NotFound from './404';

export const Board = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(undefined);
    const [issues, setIssues] = useState([]);
    
    useEffect(() => {
        API.graphql(graphqlOperation(getBoard, { id: boardId }))
            .then(result => {
                const thisBoard = result.data.getBoard;
                setBoard(thisBoard);

                (async () => {
                    const boardIssues = await getBoardIssues(thisBoard.host, thisBoard.user, thisBoard.password, thisBoard.jiraBoardId);
                    setIssues(boardIssues);
                })();
            })
            .catch((e) => setBoard(null));
        ;
    }, [boardId])

    if (board === null) {
        return <Route><NotFound/></Route>
    }

    console.log(issues);

    return <div>{boardId}</div>
};
