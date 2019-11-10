const express = require('express');
const router = express.Router();

const {
    isAuthenticated
} = require('../helpers/auth');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('index');
    } else {
        res.redirect('/users/signin');
    }
});

router.get('/about', isAuthenticated, (req, res) => {
    res.render('about');
});

module.exports = router;