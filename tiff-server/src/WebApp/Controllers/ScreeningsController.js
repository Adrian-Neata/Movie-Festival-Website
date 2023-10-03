const express = require('express');

const ServerError = require('../Models/ServerError.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ScreeningsRepository = require('../../Infrastructure/MongoDB/Repository/ScreeningsRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

Router.post('/', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    const screening = await ScreeningsRepository.addAsync(req.body);

    ResponseFilter.setResponseDetails(res, 201, screening, req.originalUrl);
});

Router.get('/', async (req, res) => {

    const screenings = await ScreeningsRepository.getAllAsync();

    const response = {
        screenings: screenings,
    }

    ResponseFilter.setResponseDetails(res, 201, response, req.originalUrl);
});

Router.get('/date/:date_id', async (req, res) => {
    let {
        date_id
    } = req.params;
    console.log("TEST")
    console.log(date_id)
    const screenings = await ScreeningsRepository.getByDateAsync(date_id);

    const response = {
        screenings: screenings,
    }

    ResponseFilter.setResponseDetails(res, 201, response, req.originalUrl);
});

Router.put('/:screening_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        screening_id
    } = req.params;

    await ScreeningsRepository.updateByIdAsync(screening_id, req.body).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Screening with id ${screening_id} updated`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.delete('/:screening_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {
    let {
        screening_id
    } = req.params;

    await ScreeningsRepository.deleteByIdAsync(screening_id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Screening with id ${screening_id} deleted`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

module.exports = Router;