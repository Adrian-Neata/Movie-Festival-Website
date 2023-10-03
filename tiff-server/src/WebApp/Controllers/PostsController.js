const express = require('express');

const ServerError = require('../Models/ServerError.js');


const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const PostsRepository = require('../../Infrastructure/MongoDB/Repository/PostsRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();

Router.post('/', authorizeAndExtractTokenAsync, async (req, res) => {
    req.body.user_id = req.user.userId
    req.body.date = new Date()

    const post = await PostsRepository.addAsync(req.body);

    ResponseFilter.setResponseDetails(res, 201, post, req.originalUrl);
});

Router.get('/', async (req, res) => {

    const posts = await PostsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 201, posts, req.originalUrl);
});

Router.get('/thread/:thread_id', async (req, res) => {
    let {
        thread_id
    } = req.params;
    
    await PostsRepository.getByThreadIdAsync(thread_id).then((posts) => {
        ResponseFilter.setResponseDetails(res, 200, posts);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.get('/user/thread/:thread_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        thread_id
    } = req.params;

    await PostsRepository.getByUserThreadIdAsync(req.user.userId, thread_id).then((posts) => {
        ResponseFilter.setResponseDetails(res, 200, posts);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.get('/:post_id', async (req, res) => {
    let {
        post_id
    } = req.params;
    
    await PostsRepository.getByIdAsync(post_id).then((post) => {
        ResponseFilter.setResponseDetails(res, 200, post);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.put('/:post_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        post_id
    } = req.params;
    
    await PostsRepository.getByIdAsync(post_id).then(async (post) => {
        if (req.user.userRole === RoleConstants.ADMIN || req.user.userRole === RoleConstants.MANAGER || post.user_id === req.user.userId) {
            await PostsRepository.updateByIdAsync(post_id, req.body).then(() => {
                ResponseFilter.setResponseDetails(res, 200, `Post with id ${post_id} updated`);
            }).catch(e => {
                ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
            })
        } else {
            throw new ServerError('Nu sunteti autorizat sa accesati resursa!', 403);
        }
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })

    
});

Router.delete('/:post_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        post_id
    } = req.params;

    await PostsRepository.getByIdAsync(post_id).then(async (post) => {
        if (req.user.userRole === RoleConstants.ADMIN || req.user.userRole === RoleConstants.MANAGER || post.user_id === req.user.userId) {
            await PostsRepository.deleteByIdAsync(post_id).then(() => {
                ResponseFilter.setResponseDetails(res, 200, `Post with id ${post_id} deleted`);
            }).catch(e => {
                ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
            })
        } else {
            throw new ServerError('Nu sunteti autorizat sa accesati resursa!', 403);
        }
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })

});

module.exports = Router;