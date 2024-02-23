package com.example.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {                     // aici avem database access methods; legatura intre API si data acces layer
    @Autowired                                  // frameworkul instantiaza clasa pentru noi
    private MovieRepository movieRepository;
    public List<Movie> allMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> singleMovie(String imdbId) {
        if (movieRepository.findMovieByImdbId(imdbId).isPresent()) {
            return movieRepository.findMovieByImdbId(imdbId);
        } else {
            return Optional.empty();
        }
    }
}
