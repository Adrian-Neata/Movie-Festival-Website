const express = require('express');

const ServerError = require('../Models/ServerError.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const VenuesRepository = require('../../Infrastructure/MongoDB/Repository/VenuesRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

Router.post('/', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {

    const venue = await VenuesRepository.addAsync(req.body);

    ResponseFilter.setResponseDetails(res, 201, venue, req.originalUrl);
});

Router.get('/', async (req, res) => {

    const venues = await VenuesRepository.getAllAsync();

    const response = {
        venues: venues,
    }

    ResponseFilter.setResponseDetails(res, 201, response, req.originalUrl);
});


Router.get('/:venue_id', async (req, res) => {
    let {
        venue_id
    } = req.params;
    
    await VenuesRepository.getByIdAsync(venue_id).then((venue) => {
        ResponseFilter.setResponseDetails(res, 200, venue);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.put('/:venue_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        venue_id
    } = req.params;
    
    await VenuesRepository.updateByIdAsync(venue_id, req.body).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Venue with id ${venue_id} updated`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.delete('/:venue_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        venue_id
    } = req.params;

    await VenuesRepository.deleteByIdAsync(venue_id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Venue with id ${venue_id} deleted`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

module.exports = Router;