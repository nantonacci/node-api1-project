// implement your API here
const db = require('./data/db.js');
const express = require('express');

const server = express();

server.listen(5000, () => {
  console.log('=== server listening on port 5000 ===');
});

server.use(express.json());

// POST - works
// /api/users
// Creates a user using the information sent inside the request body.

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide name and bio for the user.'
    });
  } else {
    db.insert({ name: name, bio: bio })
      .then(user => {
        res.status(201).json({ success: true, user });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          error: 'There was an error while saving the user to the database'
        });
      });
  }
});

// GET - works
// /api/users
// Returns an array of all the user objects contained in the database.

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ success: true, users });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: 'The users information could not be retrieved.'
      });
    });
});

// GET - works
// /api/users/:id
// Returns the user object with the specified id.

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      if (user) {
        //do thing
        res.status(200).json({ success: true, user });
      } else {
        //cancel
        res.status(404).json({
          success: false,
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: 'The user information could not be retrieved.'
      });
    });
});

// DELETE - works
// /api/users/:id
// Removes the user with the specified id and returns the deleted user.

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(deletedUser => {
      if (deletedUser) {
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ success: false, error: 'The user could not be removed' });
    });
});

// PUT - doesn't work
// /api/users/:id
// Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.

server.put('/api/users/:id', (req, res) => {
  const { name, bio } = req.body;
  const id = req.params.id;

  const userInfo = req.body;

  if (!name || !bio) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide name and bio for the user.'
    });
  }
  if (!id) {
    res.status(404).json({
      success: false,
      message: 'The user with the specified ID does not exist.'
    });
  } else {
    db.update(id, userInfo)
      .then(user => {
        res.status(200).json({ success: true, userInfo });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          error: 'The user information could not be modified.'
        });
      });
  }
});
