const express = require('express');
const router = express.Router();

//modelo
const Note = require('../models/Note');

//notes list
router.get('/notes', async (req, res) => {
    const notes = await Note.find().sort({
        created: -1
    });
    res.render('notes/all-notes', {
        notes
    });
});

//render form to add
router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

//add note to db
router.post('/notes/new-note', async (req, res) => {
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
        await newNote.save();
        req.flash('success_msg', 'Nota creada satisfactoriamente');
        res.redirect('/notes');
    }
});

//render form to edit
router.get('/notes/edit/:id', async (req, res) => {
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
router.put('/notes/edit-note/:id', async (req, res) => {
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
router.delete('/notes/delete/:id', async (req, res) => {
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