const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect to mongodb
mongoose.connect('mongodb://localhost/tiff')

mongoose.connection.once('open', function() {
  console.log('Connection to mongodb has been made...');
}).on('error', function(error) {
  console.log('Connection error:', error)
})

const UserRoleSchema = new Schema({
  _id: Number,
  name: String
});

const UserSchema = new Schema({
  email: String,
  username: String,
  password: String,
  role_id: Number,
  date_created: Date,
  confirmed: Number,
  first_name: String,
  last_name: String,
  state: String,
  address: String,
  zip_code: String,
  phone: String
});

const MovieSchema = new Schema({
  _id: Number,
  title: String,
  trailer_link: String,
  summary: String,
  poster_id: Number,
  director: String,
  writer: String,
});

const UserRole = mongoose.model('user_roles', UserRoleSchema);
const User = mongoose.model('users', UserSchema);
const Movie = mongoose.model('movies', MovieSchema);

const Roles = [
  {
    _id: 0,
    name: 'Administrator'
  },
  {
    _id: 1,
    name: 'Manager'
  },
  {
    _id: 2,
    name: 'FilmProducer'
  },
  {
    _id: 3,
    name: 'Member'
  }
]

const Users = [
  {
    email: 'admin@admin.ro',
    username: 'admin',
    password: '$2a$10$gNNltXZ1Vk590ZnyG5i08u2CjMQcnLc4o3QrjwIbDmfvHVGb4u9BC',
    role_id: 0,
    date_created: Date(),
    confirmed: 1,
  }
]

async function dropTables() {
  await mongoose.connection.collections.user_roles.drop().then(() => {
    console.log('Dropped user_roles')
  }).catch((error) => {
    console.log('USER_ROLES couldnt be dropped', error);
  })

  await mongoose.connection.collections.users.drop().then(() => {
    console.log('Dropped users')
  }).catch((error) => {
    console.log('USERS couldnt be dropped', error);
  })

  return
}

async function insertRoles() {
  for (const r of Roles) {
    const role = new UserRole(r)
    await role.save().then(function() {
      console.log("\tInserted role ", r.name);
    }).catch((error) => {
      console.log('ROLE couldnt be inserted', error);
    })
  }
}

async function insertUsers() {
  for (const u of Users) {
    const user = new User(u)
    await user.save().then(function() {
      console.log("\tInserted user ", u.username);
    }).catch((error) => {
      console.log('USER couldnt be inserted', error);
    })
  }
}

async function setup() {

  await dropTables()

  console.log('\nInserting roles...')
  await insertRoles()

  console.log('\nInserting users...')
  await insertUsers()

  console.log('\nDone.')
  UserRole.find({}).then(function(result) {
    console.log(result)
  })

}

setup()
