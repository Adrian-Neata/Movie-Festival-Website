const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new screening ${value.name}`);
    const screening = await queryAsync('screenings', {}, value, 'INSERT')

    return screening;
};

const getAllAsync = async () => {
    console.info(`Getting all screenings from database async...`);

    return await queryAsync('screenings', {});
};

const getByIdAsync = async (id) => {
    console.info(`Getting screening with id ${id}`);
    const screenings = await queryAsync('screenings', {_id: id});

    return screenings[0];
};

const getByDateAsync = async (date) => {
    console.info(`Getting screening with id ${date}`);
    const screenings = await queryAsync('screenings', {date: date});

    return screenings;
};

const updateByIdAsync = async (id, values) => {
    console.info(`Updating screening with id ${id}, from database async...`);
    const screenings = await queryAsync('screenings', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return screenings[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting screening with id ${id}, from database async...`);
    await queryAsync('screenings', {_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
    
};

const deleteByMovieIdAsync = async (id) => {
    console.info(`Deleting screening with movie_id ${id}, from database async...`);
    await queryAsync('screenings', {movie_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
    
};

const deleteByVenueIdAsync = async (id) => {
    console.info(`Deleting screening with venue_id ${id}, from database async...`);
    await queryAsync('screenings', {venue_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
    
};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync,
    getByDateAsync,
    deleteByMovieIdAsync,
    deleteByVenueIdAsync
}