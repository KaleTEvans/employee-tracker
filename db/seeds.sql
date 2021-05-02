INSERT INTO departments (name)
VALUES 
    ('Sales'),
    ('Engineering'),
    ('Legal'),
    ('AccountiUng'),
    ('Executive');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Software Engineer', '60000', 2),
    ('Lawyer', '100000', 3),
    ('Accountant', '40000', 4),
    ('Sales Lead', '100000', 1),
    ('Salesman', '50000', 1),
    ('Engineering Lead', '100000', 2),
    ('Branch Manager', '150000', 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ('Kale', 'Evans', 1, NULL),
    ('John', 'Apple', 2, NULL),
    ('James', 'Gunn', 5, 2),
    ('Kyle', 'Lowry', 4, 2),
    ('Jim', 'Beam', 3, 1);