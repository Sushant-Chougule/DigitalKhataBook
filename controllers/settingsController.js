const db = require('../database/db');
const bcrypt = require('bcryptjs');

exports.getIndex = (req, res) => {
    const user = db.prepare('SELECT id, username, full_name FROM users WHERE id = ?').get(req.session.user.id);
    res.render('pages/settings', { title: 'Settings', user, success: null, error: null });
};

exports.updateProfile = (req, res) => {
    const { full_name, username } = req.body;
    try {
        db.prepare('UPDATE users SET full_name = ?, username = ? WHERE id = ?').run(full_name, username, req.session.user.id);
        req.session.user.full_name = full_name;
        req.session.user.username = username;
        const user = db.prepare('SELECT id, username, full_name FROM users WHERE id = ?').get(req.session.user.id);
        res.render('pages/settings', { title: 'Settings', user, success: 'Profile updated successfully', error: null });
    } catch (err) {
        const user = db.prepare('SELECT id, username, full_name FROM users WHERE id = ?').get(req.session.user.id);
        res.render('pages/settings', { title: 'Settings', user, success: null, error: 'Username already exists or invalid data' });
    }
};

exports.changePassword = (req, res) => {
    const { old_password, new_password, confirm_password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.user.id);

    if (!bcrypt.compareSync(old_password, user.password)) {
        return res.render('pages/settings', { title: 'Settings', user, success: null, error: 'Incorrect old password' });
    }

    if (new_password !== confirm_password) {
        return res.render('pages/settings', { title: 'Settings', user, success: null, error: 'New passwords do not match' });
    }

    const hashed = bcrypt.hashSync(new_password, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, req.session.user.id);
    
    res.render('pages/settings', { title: 'Settings', user, success: 'Password changed successfully', error: null });
};
