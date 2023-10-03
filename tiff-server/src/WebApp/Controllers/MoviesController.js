const express = require('express');

const ServerError = require('../Models/ServerError.js');


const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const MoviesRepository = require('../../Infrastructure/MongoDB/Repository/MoviesRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

Router.post('/', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {

    const movie = await MoviesRepository.addAsync(req.body);

    ResponseFilter.setResponseDetails(res, 201, movie, req.originalUrl);
});

Router.get('/', async (req, res) => {

    const movies = await MoviesRepository.getAllAsync();

    const response = {
        movies: movies,
    }

    ResponseFilter.setResponseDetails(res, 201, response, req.originalUrl);
});

Router.get('/:movie_id', async (req, res) => {
    let {
        movie_id
    } = req.params;
    
    await MoviesRepository.getByIdAsync(movie_id).then((movie) => {
        ResponseFilter.setResponseDetails(res, 200, movie);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.put('/:movie_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {
    let {
        movie_id
    } = req.params;
    
    await MoviesRepository.updateByIdAsync(movie_id, req.body).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Movie with id ${movie_id} updated`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.delete('/:movie_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {
    let {
        movie_id
    } = req.params;

    await MoviesRepository.deleteByIdAsync(movie_id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Movie with id ${movie_id} deleted`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

module.exports = Router;