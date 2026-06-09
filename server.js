require('dotenv').config();
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Setup
require('./database/setup');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Language Middleware
const langMiddleware = require('./middleware/langMiddleware');
app.use(langMiddleware);

// EJS Setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Global Variables
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.path = req.path;
    next();
});

// Language Switcher Route
app.get('/change-lang/:lang', (req, res) => {
    const lang = req.params.lang;
    if (['en', 'mr'].includes(lang)) {
        req.session.lang = lang;
    }
    const backURL = req.header('Referer') || '/';
    res.redirect(backURL);
});

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/businesses', require('./routes/businessRoutes'));
app.use('/customers', require('./routes/customerRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));
app.use('/search', require('./routes/searchRoutes'));
app.use('/reports', require('./routes/reportsRoutes'));
app.use('/settings', require('./routes/settingsRoutes'));

// Redirect root to dashboard or login
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
