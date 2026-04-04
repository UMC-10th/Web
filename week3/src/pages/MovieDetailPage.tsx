import React from "react";
import { useParams } from "react-router-dom";

const MovieDetailPage = () => {
  const params = useParams();
  return <div>ㅇ{params.movieId}</div>;
};

export default MovieDetailPage