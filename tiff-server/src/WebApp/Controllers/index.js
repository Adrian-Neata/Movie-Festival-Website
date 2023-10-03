const Router = require('express')();

const { authorizeAndExtractTokenAsync } = require ('../Filters/JWTFilter.js');
const ProfileController = require('./ProfileController.js');
const UsersController = require('./UsersController.js');
const ImagesController = require('./ImagesController.js');
const MoviesController = require('./MoviesController.js');
const VenuesController = require('./VenuesController.js');
const ScreeningsController = require('./ScreeningsController.js');
const LikedMoviesController = require('./LikedMoviesController.js');
const ReviewsController = require('./ReviewsController.js');
const PostsController = require('./PostsController.js');
const ThreadsController = require('./ThreadsController.js');
const GraphDataController = require('./GraphDataController.js');
const HelpfulController = require('./HelpfulController.js');
const ConfirmController = require('./ConfirmController.js');

/**
 * TODO import controllers
 */

Router.use('/profile', authorizeAndExtractTokenAsync, ProfileController);
Router.use('/', UsersController);
Router.use('/image', ImagesController)
Router.use('/movies', MoviesController)
Router.use('/venues', VenuesController)
Router.use('/screenings', ScreeningsController)
Router.use('/liked_movies', authorizeAndExtractTokenAsync, LikedMoviesController)
Router.use('/reviews', ReviewsController)
Router.use('/threads', ThreadsController)
Router.use('/posts', PostsController)
Router.use('/data', GraphDataController)
Router.use('/helpful', HelpfulController)
Router.use('/confirm', ConfirmController)

/**
 * TODO add controllers to main router
 */

module.exports = Router;