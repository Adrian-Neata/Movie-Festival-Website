const ServerError = require('./ServerError.js');

class UserBody {
    constructor (body) {

        if (!body.username) {
            throw new ServerError("Username is missing", 400);
        }
    
        if (!body.email) {
            throw new ServerError("E-mail is missing", 400);
        }

        if (!body.password) {
            throw new ServerError("Password is missing", 400);
        }

        if (body.password.length < 4) {
            throw new ServerError("Password is too short!", 400);
        }

        this.username = body.username;
        this.password = body.password;
        this.email = body.email;
    }

    get Username () {
        return this.username;
    }

    get Password () {
        return this.password;
    }

    get Email() {
        return this.email;
    }
}

class UserRegisterResponse {
    constructor(user) {

        this.email = user.email;
        this.id = user.id;
        this.role_id = user.RoleId;
    }
}
class UserLoginResponse {
    constructor(token, role, username) {
        this.role = role;
        this.token = token;
        this.username = username;
    }
}
module.exports =  {
    UserBody,
    UserLoginResponse,
    UserRegisterResponse
}