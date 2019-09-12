const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

// @route    POST api/notifications
// @desc     Create a post
// @access   Private
router.get(
  '/',
  [
    auth,
  ],
  async (req, res) => {

    try {

      res.json( { msg : 'Token Verified, welcome to Github '+ req.user.user_name + ' : notifications'});

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
