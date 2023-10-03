const express = require('express');

const ServerError = require('../Models/ServerError.js');


const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ReviewsRepository = require('../../Infrastructure/MongoDB/Repository/ReviewsRepository.js');
const HelpfulRepository = require('../../Infrastructure/MongoDB/Repository/HelpfulRepository.js');
const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const Router = express.Router();
const {
    verifyAndDecodeDataAsync
} = require('../../WebCore/Security/Jwt');

Router.post('/', authorizeAndExtractTokenAsync, async (req, res) => {
    req.body.user_id = req.user.userId
    req.body.date = new Date()

    const review = await ReviewsRepository.addAsync(req.body);

    ResponseFilter.setResponseDetails(res, 201, review, req.originalUrl);
});

Router.get('/', async (req, res) => {

    const reviews = await ReviewsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 201, reviews, req.originalUrl);
});

async function getHelpfuls(reviews, user_id) {
    let aux = []
    for (let i = 0; i < reviews.length; i++) {
        res = await HelpfulRepository.getByReviewIdAsync(reviews[i]._id)

        let o = {
            _id: reviews[i]._id,
            movie_id: reviews[i].movie_id,
            user_id: reviews[i].user_id,
            date: reviews[i].date,
            body: reviews[i].body,
            nr_helpfuls: res.length,
            found_helpful: false
        }

        for (let j = 0; j < res.length; j++) {
            if (res[j].user_id == user_id) {
                o.found_helpful = true
            }
        }
        aux.push(o)
    }

    return aux
}

Router.get('/movie/:movie_id', async (req, res) => {
    let {
        movie_id
    } = req.params;
    
    await ReviewsRepository.getByMovieIdAsync(movie_id).then(async (reviews) => {
        if (req.headers.authorization !== 'null') {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = await verifyAndDecodeDataAsync(token);
            ret = await getHelpfuls(reviews, decoded.userId)
            ResponseFilter.setResponseDetails(res, 200, ret);
            return
        }
        ResponseFilter.setResponseDetails(res, 200, reviews);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, e);
    })
});

Router.get('/user/movie/:movie_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        movie_id
    } = req.params;

    await ReviewsRepository.getByUserMovieIdAsync(req.user.userId, movie_id).then((reviews) => {
        ResponseFilter.setResponseDetails(res, 200, reviews);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.get('/:review_id', async (req, res) => {
    let {
        review_id
    } = req.params;
    
    await ReviewsRepository.getByIdAsync(review_id).then((review) => {
        ResponseFilter.setResponseDetails(res, 200, review);
    }).catch(e => {
        ResponseFilter.setResponseDetails(res, 400, 'Something went wrong!');
    })
});

Router.put('/:review_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        review_id
    } = req.params;
    
    await ReviewsRepository.getByIdAsync(review_id).then(async (review) => {
        if (req.user.userRole === RoleConstants.ADMIN || req.user.userRole === RoleConstants.MANAGER || review.user_id === req.user.userId) {
            await ReviewsRepository.updateByIdAsync(review_id, req.body).then(() => {
                ResponseFilter.setResponseDetails(res, 200, `Review with id ${review_id} updated`);
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

Router.delete('/:review_id', authorizeAndExtractTokenAsync, async (req, res) => {
    let {
        review_id
    } = req.params;

    await ReviewsRepository.getByIdAsync(review_id).then(async (review) => {
        if (req.user.userRole === RoleConstants.ADMIN || req.user.userRole === RoleConstants.MANAGER || review.user_id === req.user.userId) {
            await ReviewsRepository.deleteByIdAsync(review_id).then(() => {
                ResponseFilter.setResponseDetails(res, 200, `Review with id ${review_id} deleted`);
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