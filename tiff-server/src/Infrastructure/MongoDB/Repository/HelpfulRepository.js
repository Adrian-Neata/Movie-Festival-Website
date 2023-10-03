const ScreeningsRepository = require('./ScreeningsRepository.js');

const {
    queryAsync
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding new helpful entry for review with id ${value.review_id}`);
    const helpful = await queryAsync('helpful_reviews', {}, value, 'INSERT')

    return helpful;
};

const getAllAsync = async () => {
    console.info(`Getting all helpful entries from database async...`);

    return await queryAsync('helpful_reviews', {});
};

const getByReviewIdAsync = async (id) => {
    console.info(`Getting all helpful entries for review with id ${id} from database async...`);

    return await queryAsync('helpful_reviews', {review_id: id});
};

const getByUserIdAsync = async (id) => {
    console.info(`Getting all helpful entries for user with id ${id} from database async...`);

    return await queryAsync('helpful_reviews', {user_id: id});
};

const getByUserReviewIdAsync = async (user_id, review_id) => {
    console.info(`Getting all helpful entries for user with id ${user_id} and review with id ${review_id} from database async...`);

    return await queryAsync('helpful_reviews', {user_id: user_id, review_id: review_id});
};

const getByIdAsync = async (id) => {
    console.info(`Getting helpful entry with id ${id}`);
    const helpful_reviews = await queryAsync('helpful_reviews', {_id: id});

    return helpful_reviews[0];
};

const updateByIdAsync = async (id, values) => {
    console.info(`Updating helpful entry with id ${id}, from database async...`);
    const helpful_reviews = await queryAsync('helpful_reviews', {_id: id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return helpful_reviews[0];
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting helpful entry with id ${id}, from database async...`);

    await queryAsync('helpful_reviews', {_id: id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
    
};

const deleteByUserReviewIdAsync = async (user_id, review_id) => {
    console.info(`Deleting helpful entry with user_id ${user_id} and review_id ${review_id}, from database async...`);

    await queryAsync('helpful_reviews', {user_id: user_id, review_id: review_id}, {}, 'DELETE').catch(e => {
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
    getByReviewIdAsync,
    getByUserIdAsync,
    getByUserReviewIdAsync,
    deleteByUserReviewIdAsync
}