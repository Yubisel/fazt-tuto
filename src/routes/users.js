const express = require('express');
const router = express.Router();

router.get('/users/signin', (req, res)=>{
    res.render('users/signin');
});

router.get('/users/signup', (req, res)=>{
    res.render('users/signup');
});

// router.get('/users/signout', (req, res)=>{
//     res.render('users/signout');
// });

module.exports = router;