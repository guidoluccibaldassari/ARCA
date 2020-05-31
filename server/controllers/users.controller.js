var config = require('../configApp_ro.json');
var express = require('express');
var usersRouter = express.Router();
var userService = require('services/user.service');

// routes
usersRouter.post('/authenticate', authenticate);
usersRouter.post('/register', register);
usersRouter.get('/', getAll);
usersRouter.get('/current', getCurrent);
usersRouter.put('/:_id', update);
usersRouter.delete('/:_id', _delete);

module.exports = usersRouter;

function authenticate(req, res) {
  userService
  .authenticate(req.body.username, req.body.password)
  .then(function (user) {
      if (user) {
        // authentication successful
        console.log('user:'+user)
        res.send(user);
      } else {
        // authentication failed
        res.status(400).send('Username or password is incorrect');
      }
    }
  )
  .catch(function (err) {
      res.status(400).send(err);
    }
  );
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
