const db = require('../database/db');

exports.getAll = (req, res) => {
    const businesses = db.prepare('SELECT * FROM businesses ORDER BY name ASC').all();
    res.render('pages/businesses', { title: 'Businesses', businesses });
};

exports.add = (req, res) => {
    const { name, type, description, transaction_type_name, balance_impact } = req.body;
    try {
        db.prepare('INSERT INTO businesses (name, type, description, transaction_type_name, balance_impact) VALUES (?, ?, ?, ?, ?)').run(
            name, type, description, transaction_type_name, balance_impact
        );
        res.redirect('/businesses?success=Business added successfully');
    } catch (err) {
        console.error(err);
        res.redirect('/businesses?error=Failed to add business. Transaction type must be unique.');
    }
};

exports.edit = (req, res) => {
    const id = req.params.id;
    const { name, type, description, status, transaction_type_name, balance_impact } = req.body;
    try {
        db.prepare('UPDATE businesses SET name = ?, type = ?, description = ?, status = ?, transaction_type_name = ?, balance_impact = ? WHERE id = ?').run(
            name, type, description, status, transaction_type_name, balance_impact, id
        );
        res.redirect('/businesses?success=Business updated successfully');
    } catch (err) {
        console.error(err);
        res.redirect('/businesses?error=Update failed. Transaction type might already be in use.');
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    try {
        db.prepare('DELETE FROM businesses WHERE id = ?').run(id);
        res.redirect('/businesses?success=Business deleted');
    } catch (err) {
        res.redirect('/businesses?error=Cannot delete business with existing transactions');
    }
};
