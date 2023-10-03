const PostsRepository = require('./PostsRepository.js');

const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new thread ${value.title}`);
    const thread = await queryAsync('threads', {}, value, 'INSERT')

    return thread;
};

const getAllAsync = async () => {
    console.info(`Getting all threads from database async...`);

    return await queryAsync('threads', {});
};

const getByIdAsync = async (id) => {
    console.info(`Getting thread with id ${id}`);
    const threads = await queryAsync('threads', {_id: id});

    return threads[0];
};

const updateByIdAsync = async (id, values) => {
    console.info(`Updating thread with id ${id}, from database async...`);
    const threads = await queryAsync('threads', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return threads[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting thread with id ${id}, from database async...`);

    await PostsRepository.deleteByThreadIdAsync(id).catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    await queryAsync('threads', {_id: id}, {}, 'DELETE').catch(e => {
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