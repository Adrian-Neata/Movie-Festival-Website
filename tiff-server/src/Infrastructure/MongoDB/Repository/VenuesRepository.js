const ScreeningsRepository = require('./ScreeningsRepository.js');

const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new venue ${value.name}`);
    const venue = await queryAsync('venues', {}, value, 'INSERT')

    return venue;
};

const getAllAsync = async () => {
    console.info(`Getting all venues from database async...`);

    return await queryAsync('venues', {});
};

const getByIdAsync = async (id) => {
    console.info(`Getting venue with id ${id}`);
    const venues = await queryAsync('venues', {_id: id});

    return venues[0];
};

const updateByIdAsync = async (id, values) => {
    console.info(`Updating venue with id ${id}, from database async...`);
    const venues = await queryAsync('venues', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return venues[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting venue with id ${id}, from database async...`);

    await ScreeningsRepository.deleteByVenueIdAsync(id).catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    await queryAsync('venues', {_id: id}, {}, 'DELETE').catch(e => {
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