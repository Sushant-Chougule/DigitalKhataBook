const db = require('../database/db');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('pages/login', { layout: false, error: req.query.error || null });
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = {
            id: user.id,
            username: user.username,
            full_name: user.full_name
        };
        res.redirect('/dashboard');
    } else {
        res.render('pages/login', { layout: false, error: 'err_invalid_login' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
