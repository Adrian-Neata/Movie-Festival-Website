const express = require('express')
const morgan = require('morgan');
const helmet = require('helmet');
const createError = require('http-errors');
const cors = require('cors')
const app = express()
const port = 5000

const routes = require('./src/WebApp/Controllers');

const ServerError = require('./src/WebApp/Models/ServerError.js');

app.use(helmet());
app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.json());

app.use((err, req, res, next) => {
  if (err) {
      console.error(err);
      let status = 500;
      let message = 'Something Bad Happened';
      if (err instanceof ServerError) {
          message = err.Message;
          status = err.StatusCode;
      }
      return next(createError(status, message));
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.options('*', cors())
app.use('/', routes);

app.get('/test', (req, res) => {
  res.send({ message: "We did it!" });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})