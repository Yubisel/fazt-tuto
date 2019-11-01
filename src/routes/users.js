const express = require('express');
const router = express.Router();

//modelo
const User = require('../models/User');

router.get('/users/signin', (req, res) => {
    // res.render('view', { title: 'my other page', layout: 'other' });
    res.render('users/signin', {
        layout: false
    });
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup', {
        layout: false
    });
});

router.post('/users/signup', async (req, res) => {
    const {
        name,
        email,
        password,
        confirm_password
    } = req.body;
    const errors = {};
    let haveErrors = false;

    if (!name) {
        haveErrors = true;
        errors.name = "Por favor inserta el nombre";
    }

    if (!email) {
        haveErrors = true;
        errors.email = "Por favor inserta el correo";
    }else{
        const emailUser = await User.findOne({email: email});
        if (emailUser){
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
    }else if (!confirm_password) {
        haveErrors = true;
        errors.confirm_password = "Por favor repite la contraseña";
    }

    if (haveErrors) {
        res.render('users/signup', {
            layout: false,
            errors,
            name,
            email,
            password,
            confirm_password
        });
    } else {        
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Se a registrado satisfactoriamente');
        res.redirect('/users/signin');
    }
});

module.exports = router;