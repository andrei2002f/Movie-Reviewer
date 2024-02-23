package com.example.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieService movieService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.findUserByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("An user with that username already exists");
        }
        if (userRepository.existsUserByEmail(user.getEmail())) {
            throw new RuntimeException("An user with that email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(password, user.getPassword())) {
            return JwtUtil.generateToken(username);
        } else {
            throw new RuntimeException("Wrong password");
        }
    }

    public User getUserFromToken(String token) {
        String username = JwtUtil.validateTokenAndGetUsername(token);
        return userRepository.findUserByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void addMovieToWatchlist(String username, String imdbId) {
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        imdbId = imdbId.substring(1, imdbId.length() - 1);
        Movie movie = movieService.singleMovie(imdbId).orElseThrow(() -> new RuntimeException("Movie not found"));
        user.getWatchlist().add(movie);
        userRepository.save(user);
    }

    public void removeMovieFromWatchlist(String username, String imdbId) {
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        imdbId = imdbId.substring(1, imdbId.length() - 1);
        Movie movie = movieService.singleMovie(imdbId).orElseThrow(() -> new RuntimeException("Movie not found"));
        user.getWatchlist().remove(movie);
        userRepository.save(user);
    }
}
