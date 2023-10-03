const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new post in thread with id ${value.thread_id}`);
    const post = await queryAsync('posts', {}, value, 'INSERT')

    return post;
};

const getAllAsync = async () => {
    console.info(`Getting all posts from database async...`);

    return await queryAsync('posts', {});
};

const getByIdAsync = async (id) => {
    console.info(`Getting post with id ${id}`);
    const posts = await queryAsync('posts', {_id: id});

    return posts[0];
};

const getByThreadIdAsync = async (id) => {
    console.info(`Getting posts with thread id ${id}`);

    const posts = await queryAsync('posts', {thread_id: id});

    return posts;
};

const getByUserThreadIdAsync = async(user_id, thread_id) => {
    console.info(`Getting posts from user with id ${user_id} and thread with id ${thread_id}`);
    const posts = await queryAsync('posts', {user_id: user_id, thread_id: thread_id});

    return posts;
}

const updateByIdAsync = async (id, values) => {
    console.info(`Updating post with id ${id}, from database async...`);
    const posts = await queryAsync('posts', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return posts[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting post with id ${id}, from database async...`);

    await queryAsync('posts', {_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
    
};

const deleteByThreadIdAsync = async(id) => {
    console.info(`Deleting post with thread id ${id}, from database async...`);

    await queryAsync('posts', {thread_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
}

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    getByThreadIdAsync,
    getByUserThreadIdAsync,
    updateByIdAsync,
    deleteByIdAsync,
    deleteByThreadIdAsync,
}