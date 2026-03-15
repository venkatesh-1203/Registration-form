const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const registrationRoutes = require('./routes/registration');
const adminRoutes = require('./routes/admin');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger to help debug 405 / route issues
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    next();
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'change_this_secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 4 },
    })
);

app.use('/api', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all for unknown /api routes (helps prevent 405 from static middleware)
app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Initialize database
(async () => {
    try {
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Database initialization failed:', err.message);
    }

    app.listen(PORT, () => {
        console.log(`Server up: http://localhost:${PORT}`);
    });
})();
