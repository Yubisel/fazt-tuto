const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../helpers/auth');

//modelo
const User = require('../models/User');

const passport = require('passport');

router.get('/signin', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('users/signin', {
            layout: false
        });
    }
});

router.post('/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('users/signup', {
            layout: false
        });
    }
});

router.post('/signup', async (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        const {
            name,
            lastname,
            username,
            email,
            password,
            confirm_password
        } = req.body;
        const errors = {};
        let haveErrors = false;

        if (!username) {
            haveErrors = true;
            errors.username = "Por favor inserta el usuario";
        }else{
            const usernameUser = await User.findOne({username: username});
            if (usernameUser){
                haveErrors = true;
                errors.username = "El nombre de usuario ya existe";
            }
        }

        if (!email) {
            haveErrors = true;
            errors.email = "Por favor inserta el correo";
        } else {
            const emailUser = await User.findOne({
                email: email
            });
            if (emailUser) {
                haveErrors = true;
                errors.email = "Ya existe una cuenta asociada a este correo";
            }
        }

        if (!password) {
            haveErrors = true;
            errors.password = "Por favor inserta la contraseña";
        }

        if (password != confirm_password) {
            haveErrors = true;
            errors.confirm_password = "La contraseña no coincide";
        } else if (!confirm_password) {
            haveErrors = true;
            errors.confirm_password = "Por favor repite la contraseña";
        }

        if (haveErrors) {
            res.render('users/signup', {
                layout: false,
                errors,
                name,
                lastname,
                username,
                email,
                password,
                confirm_password
            });
        } else {
            const newUser = new User({
                name,
                lastname,
                username,
                email,
                password
            });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Se a registrado satisfactoriamente');
            res.redirect('/users/signin');
        }
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/signin');
});

//Profile editing
router.get('/profile', isAuthenticated, async (req, res) => {
    res.render('users/profile');
});

router.post('/update_profile', isAuthenticated, async (req, res) => {
    res.redirect('/users/profile');
});

module.exports = router;