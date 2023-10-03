const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new review for movie with id ${value.movie_id}`);
    const review = await queryAsync('reviews', {}, value, 'INSERT')

    return review;
};

const getAllAsync = async () => {
    console.info(`Getting all reviews from database async...`);

    return await queryAsync('reviews', {});
};

const getByIdAsync = async (id) => {
    console.info(`Getting review with id ${id}`);
    const reviews = await queryAsync('reviews', {_id: id});

    return reviews[0];
};

const getByMovieIdAsync = async (id) => {
    console.info(`Getting all reviews from movie with id ${id}`);
    const reviews = await queryAsync('reviews', {movie_id: id});

    return reviews;
};

const getByUserIdAsync = async (id) => {
    console.info(`Getting all reviews from user with id ${id}`);
    const reviews = await queryAsync('reviews', {user_id: id});

    return reviews;
};

const getByUserMovieIdAsync = async(user_id, movie_id) => {
    console.info(`Getting reviews from user with id ${user_id} and movie with id ${movie_id}`);
    const reviews = await queryAsync('reviews', {user_id: user_id, movie_id: movie_id});

    return reviews[0];
}

const updateByIdAsync = async (id, values) => {
    console.info(`Updating reviews entry with id ${id}, from database async...`);
    const reviews = await queryAsync('reviews', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return reviews[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting reviews entry with id ${id}, from database async...`);


    await queryAsync('reviews', {_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
    
};

module.exports = {
    addAsync,
    getAllAsync,
    getByMovieIdAsync,
    getByUserIdAsync,
    getByUserMovieIdAsync,
    updateByIdAsync,
    deleteByIdAsync,
    getByIdAsync
}