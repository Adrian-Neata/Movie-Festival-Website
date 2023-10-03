const express = require('express');

const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const UsersRepository = require('../../Infrastructure/MongoDB/Repository/UsersRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.get('/admin', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {

    const users = await UsersRepository.getAllAsync();

    const adminResponse = {
        users: users,
    }

    ResponseFilter.setResponseDetails(res, 201, adminResponse, req.originalUrl);
});

Router.get('/manager', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.MANAGER), async (req, res) => {
    const users = await UsersRepository.getAllAsync();

    const managerResponse = {
        users: users,
    }
    
    ResponseFilter.setResponseDetails(res, 201, managerResponse, req.originalUrl);
});

Router.get('/filmproducer', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.FILMPRODUCER), async (req, res) => {
    
    const users = await UsersRepository.getAllAsync();

    const filmProducerResponse = {
        users: users,
    }
    
    ResponseFilter.setResponseDetails(res, 201, filmProducerResponse, req.originalUrl);
});

Router.get('/member', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.USER), async (req, res) => {

    const users = await UsersRepository.getAllAsync();
    let user_list = []

    for (var i = 0; i < users.length; i++) { 
        if (users[i].confirmed == 2) {
            continue
        }

        let role = ''
        if (RoleConstants.USER == users[i].role_id) {
            role = 'Member'
        } else if (RoleConstants.MANAGER == users[i].role_id) {
            role = 'Manager'
        } else if (RoleConstants.FILMPRODUCER == users[i].role_id) {
            role = 'Film Producer'
        } else if (RoleConstants.ADMIN == users[i].role_id) {
            role = 'Admin'
        }

        user_list.push({
            _id: users[i]._id,
            email: users[i].email,
            username: users[i].username,
            role: role,
            date_created: users[i].date_created,
        })
    }
    const memberResponse = {
        users: user_list,
    }
    
    ResponseFilter.setResponseDetails(res, 201, memberResponse, req.originalUrl);
});


module.exports = Router;
