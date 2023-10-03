const UsersRepository = require('../../Infrastructure/MongoDB/Repository/UsersRepository.js');
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const JwtPayloadDto = require('../DTOs/JwtPayloadDto.js');

const { hashPassword, comparePlainTextToHashedPassword } = require('../Security/Password')
const { sendConfirmationMail } = require('../Security/ConfirmationMail')

const { generateTokenAsync } = require('../Security/Jwt');
const ServerError = require('../../WebApp/Models/ServerError.js');

setInterval(async function() {
    console.log('Removing users without confirmed e-mail.')
    unconfirmedUsers  = await UsersRepository.getUnconfirmedUsersAsync()
    for(let i = 0; i < unconfirmedUsers.length; i++) {
        let diff = (new Date() - new Date(unconfirmedUsers[i].date_created)) / 60000 //minutes
        if (diff > 14) {
            UsersRepository.deleteAsync(unconfirmedUsers[i]._id)
        }
    }
}, 60 * 1000); // 60 * 1000 milsec

const authenticateAsync = async (email, plainTextPassword) => {

    console.info(`Authenticates user with e-mail ${email}`);

    const user = await UsersRepository.getByEmailWithRoleAsync(email);

    if (!user || user.confirmed === 0) {
        throw new ServerError(`Utilizatorul cu e-mail ${email} nu exista in sistem!`, 404);
    }

    /**
     * TODO
     * 
     * pas 1: verifica daca parola este buna (hint: functia compare)
     * pas 1.1.: compare returneaza true sau false. Daca parola nu e buna, arunca eroare
     * pas 2: genereaza token cu payload-ul JwtPayload
     * pas 3: returneaza AuthenticatedUserDto
     */

    const comp = await comparePlainTextToHashedPassword(plainTextPassword, user.password);

    if (!comp) {
        throw new ServerError('Utilizatorul si parola nu se potrivesc!', 401);
    }

    token = await generateTokenAsync(new JwtPayloadDto(user._id, user.role_id))

    return new AuthenticatedUserDto(token, email, user.role_id)
};

const registerAsync = async (email, username, plainTextPassword) => {
    /**
     * TODO
     * 
     * pas 1: cripteaza parola
     * pas 2: adauga (username, parola criptata) in baza de date folosind UsersRepository.addAsync
     * pas 3: returneaza RegisteredUserDto
     * 
     */
    let res = undefined
    try {
        res = await UsersRepository.getByEmailWithRoleAsync(email)
    } catch(e) {
        throw new ServerError('Ceva a mers prost!', 400);
    }

    if (res === undefined) {
        hashedPassword = await hashPassword(plainTextPassword)
        user = await UsersRepository.addAsync(email, username, hashedPassword)
        confirm_token = await generateTokenAsync({email: email, salt: 'baby don\'t hurt me'})
        confirm_link = "http://localhost:3000/confirm/" + confirm_token
        sendConfirmationMail(email, confirm_link)

        return new RegisteredUserDto(user._id, user.email, user.role_id, user.username)
    } else {
        throw new ServerError('Adresa de e-mail e deja in sistem!', 403);
    }

};

module.exports = {
    authenticateAsync,
    registerAsync,
}