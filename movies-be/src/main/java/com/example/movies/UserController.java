package com.example.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        try {
            String token = userService.login(loginUser.getUsername(), loginUser.getPassword());
            return ResponseEntity.ok().body("{\"token\": \"" + token + "\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            User user = userService.getUserFromToken(token);
            return ResponseEntity.ok().body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Profile not found: " + e.getMessage());
        }
    }

    @PostMapping("/watchlist/{username}")
    public ResponseEntity<?> addMovieToWatchlist(@PathVariable String username, @RequestBody String imdbId) {
        try {
            userService.addMovieToWatchlist(username, imdbId);
            System.out.printf("imdbId: %s, username: %s\n", imdbId, username);
            return ResponseEntity.ok("Movie added to watchlist successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Movie not added to watchlist: " + e.getMessage());
        }
    }

    @DeleteMapping("/watchlist/{username}")
    public ResponseEntity<?> removeMovieFromWatchlist(@PathVariable String username, @RequestBody String imdbId) {
        try {
            userService.removeMovieFromWatchlist(username, imdbId);
            return ResponseEntity.ok("Movie removed from watchlist successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Movie not removed from watchlist: " + e.getMessage());
        }
    }

}
