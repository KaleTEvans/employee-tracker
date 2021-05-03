const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// get all departments
router.get('/roles', (req, res) => {
    const sql = `SELECT roles.id AS ID, roles.title AS Title, departments.name AS Department
                    FROM roles, departments
                    WHERE roles.department_id = departments.id
                    ORDER BY roles.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// add a role
router.post('/role', ({ body }, res) => {

    const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?, ?, ?)`;
    const params = [body.title, body.salary, body.department_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body, 
        });
    });
});

module.exports = router;