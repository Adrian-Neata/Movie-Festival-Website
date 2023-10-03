const express = require('express');

const ServerError = require('../Models/ServerError.js');


const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const LikedMoviesRepository = require('../../Infrastructure/MongoDB/Repository/LikedMoviesRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

Router.post('/', authorizeAndExtractTokenAsync, async (req, res) => {
    req.body.user_id = req.user.userId
    const liked = await LikedMoviesRepository.addAsync(req.body);

    ResponseFilter.setResponseDetails(res, 201, liked, req.originalUrl);
});

Router.get('/', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    const likedMovies = await LikedMoviesRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 201, likedMovies, req.originalUrl);
});

Router.get('/movie/:movie_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        movie_id
    } = req.params;
    
    await LikedMoviesRepository.getByMovieIdAsync(movie_id).then((likedMovie) => {
        ResponseFilter.setResponseDetails(res, 200, likedMovie);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.get('/user/:user_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        user_id
    } = req.params;
    
    await LikedMoviesRepository.getByUserIdAsync(user_id).then((likedMovie) => {
        ResponseFilter.setResponseDetails(res, 200, likedMovie);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.get('/user/movie/:movie_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        movie_id,
    } = req.params;
    
    user_id = req.user.userId

    await LikedMoviesRepository.getByUserMovieIdAsync(user_id, movie_id).then((likedMovie) => {
        ResponseFilter.setResponseDetails(res, 200, likedMovie);
    }).catch(e => {
        console.log(e)
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.put('/:id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        id
    } = req.params;
    console.log('\n\nHERE')
    console.log(req.body)
    await LikedMoviesRepository.updateByIdAsync(id, req.body).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Like or dislike with id ${id} updated`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.delete('/:id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        id
    } = req.params;

    await LikedMoviesRepository.deleteByIdAsync(id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Like or dislike with id ${id} deleted`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

module.exports = Router;