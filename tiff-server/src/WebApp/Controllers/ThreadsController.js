const express = require('express');

const ServerError = require('../Models/ServerError.js');


const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ThreadsRepository = require('../../Infrastructure/MongoDB/Repository/ThreadsRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

Router.post('/', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANGAGER), async (req, res) => {
    req.body.user_id = req.user.userId
    req.body.date = new Date()

    await ThreadsRepository.addAsync(req.body).then((thread) => {
        ResponseFilter.setResponseDetails(res, 201, thread, req.originalUrl);
    }).catch(e => {
        console.log(e)
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })

});

Router.get('/', async (req, res) => {

    const threads = await ThreadsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 201, threads, req.originalUrl);
});

Router.get('/:thread_id', async (req, res) => {
    let {
        thread_id
    } = req.params;
    
    await ThreadsRepository.getByIdAsync(thread_id).then((thread) => {
        ResponseFilter.setResponseDetails(res, 200, thread);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.put('/:thread_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANGAGER), async (req, res) => {
    let {
        thread_id
    } = req.params;
    
    await ThreadsRepository.updateByIdAsync(thread_id, req.body).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Thread with id ${thread_id} updated`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
    
});

Router.delete('/:thread_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN, RoleConstants.MANGAGER), async (req, res) => {
    let {
        thread_id
    } = req.params;

    await ThreadsRepository.deleteByIdAsync(thread_id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `Thread with id ${thread_id} deleted`);
    }).catch(e => {
        console.log(e)
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
    
});

module.exports = Router;