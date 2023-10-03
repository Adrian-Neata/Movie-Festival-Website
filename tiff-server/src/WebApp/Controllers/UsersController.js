const express = require('express');
const UsersManager = require('../../WebCore/Managers/UsersManager.js');
const UsersRepository = require('../../Infrastructure/MongoDB/Repository/UsersRepository.js');

const {
    UserBody,
    UserRegisterResponse,
    UserLoginResponse
} = require ('../Models/Users.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const Router = express.Router();
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');

Router.post('/register', async (req, res) => {
    const userBody = new UserBody(req.body);

    await UsersManager.registerAsync(userBody.Email, userBody.Username, userBody.Password).then(user => {
        ResponseFilter.setResponseDetails(res, 201, new UserRegisterResponse(user));
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, e.statusCode, e);
    })
});

Router.post('/login', async (req, res) => {

    await UsersManager.authenticateAsync(req.body.email, req.body.password).then(async (userDto) => {
        await UsersRepository.getByEmailWithRoleAsync(req.body.email).then(userData => {
            const user = new UserLoginResponse(userDto.Token, userDto.Role, userData.username);
            ResponseFilter.setResponseDetails(res, 200, user);
        })
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, e.statusCode, e);
    })
    
});

Router.get('/users/:user_id', async (req, res) => {
    let {
        user_id
    } = req.params;
    
    await UsersRepository.getByIdAsync(user_id).then((user) => {
        ResponseFilter.setResponseDetails(res, 200, user);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.put('/users/:user_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {
    let {
        user_id
    } = req.params;
    
    await UsersRepository.updateAsync(user_id, {username: req.body.username, role_id: req.body.role_id}).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `User with id ${user_id} updated`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.delete('/users/:user_id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {
    let {
        user_id
    } = req.params;

    await UsersRepository.deleteAsync(user_id).then(() => {
        ResponseFilter.setResponseDetails(res, 200, `User with id ${user_id} deleted`);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});


module.exports = Router;
