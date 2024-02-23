import {useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';
import {useState} from 'react';

import React from 'react'

const Reviews = () => {

    const revText = useRef();
    let params = useParams();
    const movieId = params.movieId;

    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);

    const getMovieData = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/movies/${movieId}`);
            const data = await response.json();
            setMovie(data);
            setReviews(data.reviewIds);
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getMovieData(movieId);
    }, []);


    const addReview = async (e) => {
        e.preventDefault();
        const review = revText.current;
        
        try {
            const response = await fetch('http://localhost:8080/api/v1/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reviewBody: review.value,
                    imdbId: movieId,
                }),
            });

            if (response.ok) {
                const updatedReviews = [...reviews, {body: review.value}];
                revText.current.value = "";
                setReviews(updatedReviews);
            } else {
                console.log('Error adding review');
            }

            
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <Container>
            <Row>
                <Col><h3>Reviews</h3></Col>
            </Row>
            <Row className="mt-2">
                <Col >
                    <img src={movie?.poster} alt="" />
                </Col>
                <Col>
                    {
                        <>
                            <Row>
                                <Col>
                                    <ReviewForm handleSubmit={addReview} revText={revText} labelText = "Write a Review?" />  
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <hr />
                                </Col>
                            </Row>
                        </>
                    }
                    {
                        reviews?.map((r) => {
                            return(
                                <>
                                    <Row>
                                        <Col>{r.body}</Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <hr />
                                        </Col>
                                    </Row>                                
                                </>
                            )
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                </Col>
            </Row>        
        </Container>
    )
}
    

export default Reviews