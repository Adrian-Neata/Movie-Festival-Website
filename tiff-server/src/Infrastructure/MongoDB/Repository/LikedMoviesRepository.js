const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new movie like or dislike`);
    const movie = await queryAsync('liked_movies', {}, value, 'INSERT')

    return movie;
};

const getAllAsync = async () => {
    console.info(`Getting all movies' likes or dislikes from database async...`);

    return await queryAsync('liked_movies', {});
};

const getByMovieIdAsync = async (id) => {
    console.info(`Getting all likes or dislikes from movie with id ${id}`);
    const movies = await queryAsync('liked_movies', {movie_id: id});

    return movies[0];
};

const getByUserIdAsync = async (id) => {
    console.info(`Getting all likes or dislikes from user with id ${id}`);
    const movies = await queryAsync('liked_movies', {user_id: id});

    return movies[0];
};

const getByUserMovieIdAsync = async(user_id, movie_id) => {
    console.info(`Getting like or dislike from user with id ${user_id} and movie with id ${movie_id}`);
    const movies = await queryAsync('liked_movies', {user_id: user_id, movie_id: movie_id});

    return movies[0];
}

const updateByIdAsync = async (id, values) => {
    console.info(`Updating liked_movies entry with id ${id}, from database async...`);
    const movies = await queryAsync('liked_movies', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return movies[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting liked_movies entry with id ${id}, from database async...`);


    await queryAsync('liked_movies', {_id: id}, {}, 'DELETE').catch(e => {
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
    deleteByIdAsync
}