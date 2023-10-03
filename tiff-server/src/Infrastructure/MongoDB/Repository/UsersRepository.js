const {
    queryAsync,
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync('users', {});
};

const addAsync = async (email, username, password) => {
    console.info(`Adding user with e-mail ${email}`);
    const user = await queryAsync('users', {}, {email: email, username: username, password: password, role_id: 3, date_created: Date(), confirmed: 0}, 'INSERT')

    return user;
};

const getByEmailWithRoleAsync = async (email) => {
    console.info(`Getting user with e-mail ${email}`);
    const users = await queryAsync('users', {email: email});

    return users[0];
};

const getByIdAsync = async (id) => {
    console.info(`Getting user with id ${id}`);
    const users = await queryAsync('users', {_id: id});

    return users[0];
};

const updateAsync = async (user_id, values) => {
    console.info(`Updating user with id ${user_id}, from database async...`);
    const users = await queryAsync('users', {_id: user_id}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return users[0];
};

const getUnconfirmedUsersAsync = async() => {
    const users = await queryAsync('users', {confirmed: 0}).catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return users;
}

const updateByEmailAsync = async (user_email, values) => {
    console.info(`Updating user with email ${user_email}, from database async...`);
    const users = await queryAsync('users', {email: user_email}, values, 'UPDATE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return users[0];
};

const deleteAsync = async (user_id) => {
    console.info(`Deleting user with id ${user_id}, from database async...`);
    await queryAsync('users', {_id: user_id}, {}, 'DELETE').catch(e => {
        throw new ServerError("Something went wrong", 400);
    })

    return ''
}

module.exports = {
    getAllAsync,
    addAsync,
    updateAsync,
    deleteAsync,
    getByIdAsync,
    updateByEmailAsync,
    getByEmailWithRoleAsync,
    getUnconfirmedUsersAsync
}