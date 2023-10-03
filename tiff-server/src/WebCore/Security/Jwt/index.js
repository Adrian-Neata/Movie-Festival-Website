const jwt = require('jsonwebtoken');

const ServerError = require('../../../WebApp/Models/ServerError.js');

const options = {
    issuer: 'pw backend',
    subject: 'pw',
    audience: 'pw client'
};

const generateTokenAsync = async (payload) => {
    // TODO
    // HINT: folositi functia "sign" din biblioteca jsonwebtoken
    // HINT2: seamana cu functia verify folosita mai jos ;)
    /*
     payload este JwtPayloadDto
    */

    return jwt.sign(JSON.parse(JSON.stringify(payload)), 'myawesomeultrasecretkey', options);
};

const verifyAndDecodeDataAsync = async (token) => {
    try {
        const decoded = await jwt.verify(token, 'myawesomeultrasecretkey', options);
        return decoded;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Eroare la decriptarea tokenului!", 401);
    }
};

module.exports = {
    generateTokenAsync,
    verifyAndDecodeDataAsync
};
