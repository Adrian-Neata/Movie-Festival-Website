const ScreeningsRepository = require('./ScreeningsRepository.js');

const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new movie ${value.title}`);
    const movie = await queryAsync('movies', {}, value, 'INSERT')

    return movie;
};

const getAllAsync = async () => {
    console.info(`Getting all movies from database async...`);

    return await queryAsync('movies', {});
};

const getByIdAsync = async (id) => {
    console.info(`Getting movie with id ${id}`);
    const movies = await queryAsync('movies', {_id: id});

    return movies[0];
};

const updateByIdAsync = async (id, values) => {
    console.info(`Updating movie with id ${id}, from database async...`);
    const movies = await queryAsync('movies', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return movies[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting movie with id ${id}, from database async...`);

    await ScreeningsRepository.deleteByMovieIdAsync(id).catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    await queryAsync('movies', {_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
    
};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync
}