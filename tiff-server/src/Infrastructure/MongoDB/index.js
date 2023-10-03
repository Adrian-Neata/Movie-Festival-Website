const mongoose = require('mongoose');
const Grid = require("gridfs-stream");

const Schema = mongoose.Schema;

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
  title: String,
  trailer_link: String,
  summary: String,
  poster_id: String,
  director: String,
  writer: String,
  genres: Array,
});

const VenueSchema = new Schema({
  name: String,
  address: String,
  description: String,
  latitude: Number,
  longitude: Number,
  nr_seats: Number,
  photo_id: String,
});

const ScreeningSchema = new Schema({
  movie_id: String,
  venue_id: String,
  date: Date,
  startHour: Number,
  endHour: Number,
});

const ReviewSchema = new Schema({
  movie_id: String,
  user_id: String,
  date: Date,
  body: String,
});

const HelpfulSchema = new Schema({
  user_id: String,
  review_id: String,
});

const LikedMovie = new Schema({
  user_id: String,
  movie_id: String,
  liked: Boolean,
});

const Threads = new Schema({
  title: String,
  date: String,
  description: String,
  user_id: String,
});

const Posts = new Schema({
  user_id: String,
  thread_id: String,
  body: String,
  date: String,
});

mongoose.model('user_roles', UserRoleSchema);
mongoose.model('users', UserSchema);
mongoose.model('movies', MovieSchema);
mongoose.model('venues', VenueSchema);
mongoose.model('screenings', ScreeningSchema);

mongoose.model('reviews', ReviewSchema);
mongoose.model('helpful_reviews', HelpfulSchema);
mongoose.model('liked_movies', LikedMovie);
mongoose.model('threads', Threads);
mongoose.model('posts', Posts);

// connect to mongodb
mongoose.connect('mongodb://localhost/tiff')

mongoose.connection.once('open', function() {
  console.log('Connection to mongodb has been made...');
  
}).on('error', function(error) {
  console.log('Connection error:', error)
});

async function getGFS() {
  var gfs;
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");

  return gfs
}

//TODO
async function queryAsync(model_name, match, values={}, operation_type='SELECT') {
  const start = Date.now();
  var model = mongoose.model(model_name)

  if (operation_type == 'SELECT') {
    result = await model.find(match)
  } else if (operation_type == 'UPDATE') {
    result = await model.update(match, { $set: values }).catch(e => {
      console.log(e)
    })
  } else if (operation_type == 'INSERT') {
    const m = new model(values)
    result = await m.save()
  } else if (operation_type == 'DELETE') {
    result = await model.deleteMany(match)
  }
  const duration = Date.now() - start;
  console.log(`Query took ${duration} and returned ${result.length} rows.`);

  return result
};

module.exports = {
  queryAsync,
  getGFS
};