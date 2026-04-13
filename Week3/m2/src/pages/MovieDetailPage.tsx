import { useParams } from "react-router-dom";

const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    return <div>MovieDetailPage{id} </div>
};

export default MovieDetailPage;