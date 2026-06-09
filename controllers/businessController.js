const db = require('../database/db');

exports.getAll = (req, res) => {
    const businesses = db.prepare('SELECT * FROM businesses ORDER BY name ASC').all();
    res.render('pages/businesses', { title: 'Businesses', businesses });
};

exports.add = (req, res) => {
    const { name, type, description } = req.body;
    db.prepare('INSERT INTO businesses (name, type, description) VALUES (?, ?, ?)').run(name, type, description);
    res.redirect('/businesses');
};

exports.edit = (req, res) => {
    const id = req.params.id;
    const { name, type, description, status } = req.body;
    db.prepare('UPDATE businesses SET name = ?, type = ?, description = ?, status = ? WHERE id = ?').run(
        name, type, description, status, id
    );
    res.redirect('/businesses');
};

exports.delete = (req, res) => {
    const id = req.params.id;
    db.prepare('DELETE FROM businesses WHERE id = ?').run(id);
    res.redirect('/businesses');
};
