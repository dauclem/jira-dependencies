import { useParams } from 'react-router-dom'

export const Board = () => {
    const { boardId } = useParams();

    return <div>{boardId}</div>
};
