const fs = require('fs');
const path = require('path');

const locales = {};
const localesDir = path.join(__dirname, '../locales');

// Load all translation files in the locales directory
fs.readdirSync(localesDir).forEach(file => {
    if (file.endsWith('.json')) {
        const lang = file.replace('.json', '');
        locales[lang] = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
    }
});

module.exports = (req, res, next) => {
    const lang = req.session.lang || 'en';
    
    // Translation helper
    res.locals.__ = (key) => {
        if (!key) return "";
        return locales[lang][key] || key;
    };
    
    // Indian Date & Time Formatter helper
    res.locals.formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        // Format: DD-MM-YYYY HH:mm:ss
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${d}-${m}-${y} ${h}:${min}:${s}`;
    };

    res.locals.currentLang = lang;
    next();
};
