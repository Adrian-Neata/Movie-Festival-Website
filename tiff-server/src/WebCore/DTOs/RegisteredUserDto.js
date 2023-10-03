class RegisteredUserDto {
    constructor (id, email, role_id, username) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.roleId = role_id;
    }

    get Id() {
        return this.id;
    }

    get Email() {
        return this.email;
    }

    get Username() {
        return this.username;
    }
    
    get RoleId() {
        return this.roleId;
    }
}

module.exports = RegisteredUserDto;