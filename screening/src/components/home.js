import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/movie/movies")
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
    <div>
      <h1>Ongoing Movies</h1>
      <div className="movies-container container">
        {movies?.map((movie) => {
          console.log(movie.poster);
          return(
          <div key={movie._id} className="movie-card">
            <img src={movie.poster} alt={movie.title} className="image-fluid mx-auto d-block" />
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p>Release Date: {movie.releaseDate}</p>
            <p>Genre: {movie.genre}</p>
          </div>
        )})}
      </div>
    </div>
  );
};

export default Home;
