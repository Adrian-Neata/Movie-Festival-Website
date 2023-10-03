const express = require('express');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const HelpfulRepository = require('../../Infrastructure/MongoDB/Repository/HelpfulRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

Router.post('/', authorizeAndExtractTokenAsync, async (req, res) => {
    req.body.user_id = req.user.userId

    const r = await HelpfulRepository.getByUserReviewIdAsync(req.body.user_id, req.body.review_id)

    if (r.length != 0) {
        ResponseFilter.setResponseDetails(res, 403, 'Utilizatorul deja considera utila recenzia!', req.originalUrl);
        return
    }

    const movie = await HelpfulRepository.addAsync(req.body);

    ResponseFilter.setResponseDetails(res, 201, movie, req.originalUrl);
});

Router.get('/', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANAGER), async (req, res) => {

    const helpful = await HelpfulRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 201, helpful, req.originalUrl);
});

Router.get('/user', authorizeAndExtractTokenAsync, async (req, res) => {

    const helpful = await HelpfulRepository.getByUserIdAsync(req.user.userId);

    ResponseFilter.setResponseDetails(res, 201, helpful, req.originalUrl);
});

Router.delete('/:helpful_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        helpful_id
    } = req.params;

    await HelpfulRepository.deleteByIdAsync(helpful_id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Helpful entry with id ${helpful_id} deleted`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.delete('/review/:review_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        review_id
    } = req.params;

    await HelpfulRepository.deleteByUserReviewIdAsync(req.user.userId, review_id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Helpful entry with user_id ${req.user.userId} and review_id ${review_id} deleted`);
    }).catch(e => {
        console.log(e)
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

module.exports = Router;