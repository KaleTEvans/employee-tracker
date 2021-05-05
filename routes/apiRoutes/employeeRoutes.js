const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// get all departments
router.get('/employees', (req, res) => {
    const sql = `SELECT employees.id AS ID, employees.first_name AS First_Name, 
                    employees.last_name AS Last_Name,
                    roles.title  AS Title, departments.name AS Department, roles.salary AS Salary,
                    CONCAT(e.first_name, ' ', e.last_name)
                    AS Manager FROM employees
                    INNER JOIN roles on roles.id = employees.role_id
                    INNER JOIN departments on departments.id = roles.department_id
                    LEFT JOIN employees e on employees.manager_id = e.id`;
                    
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

// add an employee
router.post('/employee', ({ body }, res) => {

    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

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

// update an employee role
router.put('/employee/:id', (req, res) => {
    const sql = `UPDATE employees SET role_id = ?
                    WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Employee not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
})

module.exports = router;