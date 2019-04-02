const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// this does not uses sessions
/*
module.exports = (req, res, next) => {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Ran into an unexpected error' });
      });
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
*/

// create a middleware to add to restricted routes
module.exports = (req, res, next) => {  
  // if the session has an user
  if (req.session && req.session.user) {
    // do your thing:
    next();
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
