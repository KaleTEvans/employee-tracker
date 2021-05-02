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

module.exports = router;