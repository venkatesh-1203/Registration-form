const db = require('../db');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

const login = (req, res) => {
    const { username, password } = req.body;

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'password';

    if (username === expectedUsername && password === expectedPassword) {
        req.session.isAdmin = true;
        return res.json({ success: true });
    }

    res.status(401).json({ error: 'Invalid credentials' });
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
};

const requireAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

const exportCsv = (req, res) => {
    try {
        const selectStmt = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC');
        const rows = selectStmt.all();

        const csvStringifier = createCsvWriter({
            header: [
                { id: 'id', title: 'ID' },
                { id: 'name', title: 'Name' },
                { id: 'phone', title: 'Phone' },
                { id: 'email', title: 'Email' },
                { id: 'college', title: 'College' },
                { id: 'department', title: 'Department' },
                { id: 'year', title: 'Year' },
                { id: 'created_at', title: 'Created At' },
            ],
        });

        const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(rows);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
        res.send(csvData);
    } catch (error) {
        console.error('exportCsv error', error);
        res.status(500).json({ error: 'Failed to export CSV' });
    }
};

module.exports = {
    login,
    logout,
    requireAdmin,
    exportCsv,
};
