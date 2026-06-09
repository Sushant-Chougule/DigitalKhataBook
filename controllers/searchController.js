const db = require('../database/db');

exports.getSearch = (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.render('pages/search', { title: 'Search', results: null, query: '' });
    }

    const searchTerm = `%${query}%`;

    const customers = db.prepare(`
        SELECT * FROM customers 
        WHERE full_name LIKE ? OR mobile LIKE ? OR village_city LIKE ?
    `).all(searchTerm, searchTerm, searchTerm);

    const transactions = db.prepare(`
        SELECT t.*, c.full_name as customer_name, b.name as business_name 
        FROM transactions t
        JOIN customers c ON t.customer_id = c.id
        LEFT JOIN businesses b ON t.business_id = b.id
        WHERE c.full_name LIKE ? OR t.remarks LIKE ? OR t.type LIKE ?
    `).all(searchTerm, searchTerm, searchTerm);

    res.render('pages/search', { 
        title: 'Search Results', 
        results: { customers, transactions },
        query
    });
};
