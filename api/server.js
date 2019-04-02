const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// add in session dependency
const session = require('express-session');
// library to persist session on harddrive
const SessionStore = require( 'connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

// create session config file to config
const sessionConfig = {
  name: 'monkey',
  secret: '', // dont store the secret in your code, save it in an .env file
  cookie: {
    maxAge: 1000 * 60 * 60, // in miliseconds - how long it takes for this cookie to expire
    secure: false, // needs to be true in PRODUCTION!. only do any of this over HTTPS!!!  In testing/dev it can be false, because you're not using HTTPS
  },
  httpOnly: true, // cookie is not accessible with JS
  resave: false, // don't recreate the session if nothing has changed
  saveUninitialized: false, // if there are not changes to this session, do not save anything
  // THESE ARE TO GET PERSISTENCE OF SESSION ON HARD DRIVE WITH connect-session-knex
  store: new SessionStore({
    knex: require('../database/dbConfig'), // takes knex config file
    tablename: 'active_sessions', // table that will contain live sessions in the DB
    sidfieldname: 'sid', // collumn on the table that will hold the session ID
    createtable: true,
    clearInterval: 1000 * 60 * 60 // interval on how often you should clean table - 1 hour
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
// invoke session dependency and pass in the config 
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send("It's alive!");
});

module.exports = server;
