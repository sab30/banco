const express = require('express');
const router = express.Router();
const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('config');




// @route    GET api/users/github/:username
// @desc     Get user repos from Github
// @URL      localhost:5000/api/users/github/bradtraversy
// @access   Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=10&sort=created:asc&client_id=${config.get('githubClientId' )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




// @route    GET api/users/github/:username/:per_page
// @desc     Get user repos from Github
// @URL      localhost:5000/api/users/github/bradtraversy
// @access   Public
router.get('/github/:username/:per_page', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=${req.params.page}&sort=created:asc&client_id=${config.get('githubClientId' )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
