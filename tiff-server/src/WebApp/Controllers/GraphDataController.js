const express = require('express');

const ServerError = require('../Models/ServerError.js');


const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const LikedMoviesRepository = require('../../Infrastructure/MongoDB/Repository/LikedMoviesRepository.js');
const ReviewsRepository = require('../../Infrastructure/MongoDB/Repository/ReviewsRepository.js');
const MoviesRepository = require('../../Infrastructure/MongoDB/Repository/MoviesRepository.js');
const UsersRepository = require('../../Infrastructure/MongoDB/Repository/UsersRepository.js');
const PostsRepository = require('../../Infrastructure/MongoDB/Repository/PostsRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

function convertMovieIdToTitle(d, movies) {
    let data = {}
    let keys = Object.keys(d)

    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < movies.length; j++) {
            if (movies[j]._id == keys[i]) {

                data[movies[j].title] = d[keys[i]]
                break
            }
        }
    }
    return data
}

function convertUserIdToName(d, users) {
    let data = {}
    let keys = Object.keys(d)

    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < users.length; j++) {
            if (users[j]._id == keys[i]) {

                data[users[j].username] = d[keys[i]]
                break
            }
        }
    }
    return data
}

Router.get('/top_movies/likes', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    await LikedMoviesRepository.getAllAsync().then(async (likedMovies) => {
        await MoviesRepository.getAllAsync().then((movies) => {

            let movies_likes = {}
            for(let i = 0; i < likedMovies.length; i++) {
                if (likedMovies[i].liked) {
                    if (movies_likes[likedMovies[i].movie_id] === undefined) {
                        movies_likes[likedMovies[i].movie_id] = 1;
                    } else {
                        movies_likes[likedMovies[i].movie_id]++;
                    }
                }
            }

            let data = convertMovieIdToTitle(movies_likes, movies)

            ResponseFilter.setResponseDetails(res, 201, data, req.originalUrl);
        }).catch(e => {
            ResponseFilter.setResponseDetails(res, 400, e);
        })

    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, e);
    })

});

Router.get('/top_movies/dislikes', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    await LikedMoviesRepository.getAllAsync().then(async (likedMovies) => {
        await MoviesRepository.getAllAsync().then((movies) => {

            let movies_likes = {}
            for(let i = 0; i < likedMovies.length; i++) {
                if (!likedMovies[i].liked) {
                    if (movies_likes[likedMovies[i].movie_id] === undefined) {
                        movies_likes[likedMovies[i].movie_id] = 1;
                    } else {
                        movies_likes[likedMovies[i].movie_id]++;
                    }
                }
            }

            let data = convertMovieIdToTitle(movies_likes, movies)

            ResponseFilter.setResponseDetails(res, 201, data, req.originalUrl);
        }).catch(e => {
            ResponseFilter.setResponseDetails(res, 400, e);
        })

    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, e);
    })

});

Router.get('/top_movies/reviews', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    await ReviewsRepository.getAllAsync().then(async (reviews) => {
        await MoviesRepository.getAllAsync().then((movies) => {

            let movies_reviews = {}
            for(let i = 0; i < reviews.length; i++) {
                if (movies_reviews[reviews[i].movie_id] === undefined) {
                    movies_reviews[reviews[i].movie_id] = 1;
                } else {
                    movies_reviews[reviews[i].movie_id]++;
                }
            }

            let data = convertMovieIdToTitle(movies_reviews, movies)

            ResponseFilter.setResponseDetails(res, 201, data, req.originalUrl);
        }).catch(e => {
            ResponseFilter.setResponseDetails(res, 400, e);
        })

    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, e);
    })

});

Router.get('/top_users/reviews', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    await ReviewsRepository.getAllAsync().then(async (reviews) => {
        await UsersRepository.getAllAsync().then((users) => {

            let users_reviews = {}
            for(let i = 0; i < reviews.length; i++) {
                if (users_reviews[reviews[i].user_id] === undefined) {
                    users_reviews[reviews[i].user_id] = 1;
                } else {
                    users_reviews[reviews[i].user_id]++;
                }
            }

            let data = convertUserIdToName(users_reviews, users)
            console.log('\n\n\nheyyy')
            console.log(data)
            ResponseFilter.setResponseDetails(res, 201, data, req.originalUrl);
        }).catch(e => {
            ResponseFilter.setResponseDetails(res, 400, e);
        })

    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, e);
    })

});

Router.get('/top_users/posts', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    await PostsRepository.getAllAsync().then(async (posts) => {
        await UsersRepository.getAllAsync().then((users) => {

            let users_posts = {}
            for(let i = 0; i < posts.length; i++) {
                if (users_posts[posts[i].user_id] === undefined) {
                    users_posts[posts[i].user_id] = 1;
                } else {
                    users_posts[posts[i].user_id]++;
                }
            }

            let data = convertUserIdToName(users_posts, users)

            ResponseFilter.setResponseDetails(res, 201, data, req.originalUrl);
        }).catch(e => {
            ResponseFilter.setResponseDetails(res, 400, e);
        })

    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, e);
    })

});
module.exports = Router;