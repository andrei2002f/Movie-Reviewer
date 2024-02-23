import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import './WatchList.css';

const WatchList = () => {
    const navigate = useNavigate();
    const [watchList, setWatchList] = useState([]);
    const [username, setUsername] = useState('');
    const token = localStorage.getItem('token');
    
    useEffect(() => {

        if (token)
            fetchUserProfile(token);

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
                setWatchList(data.watchlist);
                setUsername(data.username);
            } else {
                console.log('Profile fetch failed');
            }
        }
        catch (error) {
            console.error('Profile fetch failed:', error);
        }
    }

    const removeFromWatchList = async (imdbId) => {
        if (!token || !username) {
            alert("You must be logged in to modify your watchlist.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/watchlist/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(imdbId),
            });

            if (!response.ok) throw new Error('Failed to remove movie from watchlist');
            alert("Movie removed from watchlist successfully!");
            setWatchList(watchList.filter(movie => movie.imdbId !== imdbId));
        } catch (error) {
            console.error("Error removing movie from watchlist:", error);
            alert("Error removing movie from watchlist. Please try again.");
        }
    };

    return (
        <div className="watchlist-container">
            {watchList.length > 0 ? (
                <div className="watchlist-content">
                    <h2 className="watchlist-title">Your Watchlist</h2>
                    <ul className="watchlist-movies">
                        {watchList.map((movie) => (
                            <li key={movie.imdbId} className="watchlist-movie">
                                <img src={movie.poster} alt={movie.title} />
                                <div className="watchlist-movie-details">
                                    <h3 className="watchlist-movie-title">{movie.title}</h3>
                                    <button className="remove-watchlist-btn" onClick={() => removeFromWatchList(movie.imdbId)}>
                                        Remove from Watchlist
                                    </button>
                                    </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="watchlist-message">
                    {!localStorage.getItem('token') ? (
                        <p>Please <a href="#" onClick={() => navigate('/login')}>log in</a> to see your watchlist.</p>
                    ) : (
                        <p>Your watchlist is empty.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WatchList;