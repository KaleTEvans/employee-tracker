const inquirer = require('inquirer');
const fetch = require('node-fetch');
const cTable = require('console.table');

const pathWay = 'http://localhost:3001/api';

const startApp = () => {
    console.log(
`
+------------------+
| EMPLOYEE TRACKER |
+------------------+
`
    )
    inquirer.prompt([
        {
            type: 'list',
            name: 'optionSelect',
            message: 'Select an option',
            choices: ['View all departments', 'View all roles', 'View all employees', 
                        'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ]).then(({ optionSelect }) => {
        if (optionSelect === 'View all departments') {
            return departmentView();
        }
        if (optionSelect === 'View all roles') {
            return roleView();
        }
        if (optionSelect === 'View all employees') {
            return employeeView();
        }
        if (optionSelect === 'Add a department') {
            return departmentAdd();
        }
        if (optionSelect === 'Add a role') {
            return rollAdd();
        }
        if (optionSelect === 'Add an employee') {
            return employeeAdd();
        }
        if (optionSelect === 'Update an employee role') {
            return employeeUpdate();
        }
    })
}

const portalFunction = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'returnSelect',
            message: 'Return to main menu?',
            choices: ['Yes', 'No']
        }
    ]).then(({ returnSelect }) => {
        if (returnSelect === 'Yes') {
            return startApp();
        }
        if (returnSelect === 'No') {
            return false;
        }
    });
};

const departmentView = () => {
    fetch(`${pathWay}/departments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(json => {
        console.table(json.data);
    })
    .then(portalFunction);
};

const roleView = () => {
    fetch(`${pathWay}/roles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'applocation/json',
        },
    }).then(res => res.json())
    .then(json => {
        
        console.table(json.data);
    })
    .then(portalFunction);
}

const employeeView = () => {
    fetch(`${pathWay}/employees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'applocation/json',
        },
    }).then(res => res.json())
    .then(json => {
        console.table(json.data);
    })
    .then(portalFunction);
}

module.exports = { startApp };