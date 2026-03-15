const db = require('../db');
const { sendConfirmationEmail } = require('../emailService');

const createRegistration = async (req, res) => {
    const { name, phone, email, college, department, year } = req.body;
    if (!name || !phone || !email || !college || !department || !year) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const insertStmt = db.prepare(`
            INSERT INTO registrations (name, phone, email, college, department, year)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = insertStmt.run(name.trim(), phone.trim(), email.trim(), college.trim(), department.trim(), year.trim());
        const registrationId = result.lastInsertRowid;

        // Send confirmation email
        const emailResult = await sendConfirmationEmail(email, {
            id: registrationId,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            college: college.trim(),
            department: department.trim(),
            year: year.trim(),
        });

        if (!emailResult.success) {
            console.warn('Email sending failed, but registration was successful:', emailResult.error);
        }

        res.json({
            success: true,
            registrationId,
            message: 'Registration completed successfully! A confirmation email has been sent to your email address.'
        });
    } catch (error) {
        console.error('createRegistration error', error);
        res.status(500).json({ error: 'Failed to create registration. Please try again.' });
    }
};

const getRegistrations = (req, res) => {
    try {
        const selectStmt = db.prepare(`
            SELECT id, name, phone, email, college, department, year, created_at
            FROM registrations
            ORDER BY created_at DESC
        `);
        const rows = selectStmt.all();

        res.json(rows);
    } catch (error) {
        console.error('getRegistrations error', error);
        res.status(500).json({ error: 'Failed to fetch registrations.' });
    }
};

module.exports = {
    createRegistration,
    getRegistrations
};
