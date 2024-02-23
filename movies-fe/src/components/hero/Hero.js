import React from 'react'
import './Hero.css'
import Carousel from 'react-material-ui-carousel'
import {Paper} from '@mui/material'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const Hero = () => {

  const navigate = useNavigate();
  const [movies, setMovies] = useState();
  const [username, setUsername] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    getMovies();

    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/users/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
        } else {
            console.log('Profile fetch failed');
        }
    }
    catch (error) {
        console.error('Profile fetch failed:', error);
    }
  }


  const addToWatchList = async (imdbId) => {
    if (!token || !username) {
      alert('Please log in to add to watchlist');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/watchlist/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(imdbId),
      });
      if (response.ok) {
        alert('Movie added to watchlist');
      } else {
        console.log('Add to watchlist failed');
      }
    } catch (error) {
      console.error('Add to watchlist failed:', error);
    }
  }


  const getMovies = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
    console.error(error);
    }
  }

  function reviews(movieId) {
	  navigate(`/Reviews/${movieId}`);
  }

  return (
    <div>
      <Carousel>
        {
            movies?.map((movie) => {
                return (
                    <Paper key={movie.imdbId}>
                        <div className="movie-card-container">
                            <div className="movie-card" style={{"--img": `url(${movie.backdrops[0]})`}}>
                                <div className="movie-detail">
                                    <div className="movie-poster">
                                        <img src = {movie.poster} alt = "" />
                                    </div>
                                    <div className="movie-title">
                                        <h4>{movie.title}</h4>
                                    </div>
                                    <div className="movie-buttons-container">
                                      <Link to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length-11)}`} >
                                        <FontAwesomeIcon className="play-button-icon" icon={faCirclePlay} />
                                      </Link>
                                      <Button variant="info" onClick={() => reviews(movie.imdbId)}>Review</Button>
                                      <Button variant="warning" onClick={() => addToWatchList(movie.imdbId)}>Add to Watchlist</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Paper>
                )
            })
        }
      </Carousel>
    </div>
  )
}

export default Hero