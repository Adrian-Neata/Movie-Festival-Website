class AuthenticatedUserDto {
    constructor (token, email, role) {
        this.token = token;
        this.role = role;
        this.email = email;
    }

    get Token() {
        return this.token;
    }

    get Role() {
        return this.role;
    }

    get Email() {
        return this.email;
    }
}

module.exports = AuthenticatedUserDto;