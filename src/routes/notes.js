const express = require('express');
const router = express.Router();

//modelo
const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/auth');


//notes list
router.get('/', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({
        created: -1
    });
    res.render('notes/all-notes', {
        notes
    });
});

//render form to add
router.get('/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

//add note to db
router.post('/new-note', isAuthenticated, async (req, res) => {
    const {
        title,
        description
    } = req.body;
    const errors = {};
    let haveErrors = false;

    if (!title) {
        haveErrors = true;
        errors.title = 'Por favor inserta el título';
    }
    if (!description) {
        haveErrors = true;
        errors.description = 'Por favor inserta una descripción';
    }

    if (haveErrors) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({
            title,
            description
        });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota creada satisfactoriamente');
        res.redirect('/notes');
    }
});

//render form to edit
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    await Note.findById(req.params.id, (err, note) => {
        if (err) {
            req.flash('error_msg', 'No existe ninguna nota con el id especificado');
            res.redirect('/notes');
        } else {
            res.render('notes/edit-note', {
                note
            });
        }
    });
});

//update note to db
router.put('/edit-note/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id, (err, note) => {
        if (err) {
            req.flash('error_msg', 'No existe ninguna nota con el id especificado');
            res.redirect('/notes');
        }
    });

    const {
        title,
        description
    } = req.body;

    const errors = {};
    let haveErrors = false;

    if (!title) {
        haveErrors = true;
        errors.title = 'Por favor inserta el título';
    }
    if (!description) {
        haveErrors = true;
        errors.description = 'Por favor inserta una descripción';
    }

    if (haveErrors) {
        res.render('notes/edit-note', {
            errors,
            note
        });
    } else {
        await Note.findByIdAndUpdate(req.params.id, {
            title,
            description
        }, (err) => {
            if (err) {
                req.flash('error_msg', 'No se pudo actualizar la nota especificada');
            } else {
                req.flash('success_msg', 'Nota actualizada satisfactoriamente');
            }
            res.redirect('/notes');
        });
    }
});

//delete note from db
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            req.flash('error_msg', 'No se pudo eliminar la nota especificada');
        } else {
            req.flash('success_msg', 'Nota eliminada satisfactoriamente');
        }
        res.redirect('/notes');
    });
});

module.exports = router;