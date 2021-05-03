const inquirer = require('inquirer');
const fetch = require('node-fetch');
const cTable = require('console.table');
const { response } = require('express');


const pathWay = 'http://localhost:3001/api';
const departmentArray = [];

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
            inquirer.prompt([
                {
                    type: 'text',
                    name: 'departmentName',
                    message: 'Enter the department name'
                }
            ]).then(departmentName => {
                departmentAdd(departmentName);
            });
        }
        if (optionSelect === 'Add a role') {
            departmentList();
            inquirer.prompt([
                {
                    type: 'text',
                    name: 'roleName',
                    message: 'Enter the name of the role',
                    validate: roleName => {
                        if (roleName) {
                            return true;
                        } else {
                            console.log('Please enter a valid role name');
                            return false;
                        }
                    }
                },
                {
                    type: 'number',
                    name: 'roleSalary',
                    message: 'Enter the salary of the role',
                    validate: roleSalary => {
                        if (roleSalary) {
                            return true;
                        } else {
                            console.log('Please enter a valid salary');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'departmentSelect',
                    message: "Select the role's department",
                    choices: departmentArray
                }
            ]).then(({ roleName, roleSalary, departmentSelect }) => {
                let departmentId;
                departmentArray.forEach(department => {
                    if (departmentSelect === department.name) {
                        departmentId = department.id;
                    }
                })
                let newSalary = JSON.stringify(roleSalary);
                roleAdd(roleName, newSalary, departmentId);
            })
        }
        if (optionSelect === 'Add an employee') {
            inquirer.prompt([
                {
                    type: 'text',
                    name: 'employeeName',
                    message: 'Enter the name of the employee'
                }
            ])
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
            'Content-Type': 'application/json',
        },
    }).then(res => res.json())
    .then(json => {
        console.table(json.data);
    })
    .then(portalFunction);
};

const employeeView = () => {
    fetch(`${pathWay}/employees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json())
    .then(json => {
        console.table(json.data);
    })
    .then(portalFunction);
};

const departmentAdd = (departmentName) => {
    (async () => {
        const rawResponse = await fetch(`${pathWay}/department`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: departmentName.departmentName })
        });
        const content = await rawResponse.json();

        console.log(`${content.data.name} added to Departments.`);
    })().then(portalFunction)
};

const roleAdd = (roleName, roleSalary, departmentId) => {
    console.log(roleName, roleSalary, departmentId);
    (async () => {
        const rawResponse = await fetch(`${pathWay}/role`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                title: roleName,
                salary: roleSalary,
                department_id: departmentId
            })
        });
        const content = await rawResponse.json();

        console.log(`${content.data.title} added to Roles`);
    })().then(portalFunction)
};


// functions to acquire lists for selection
const departmentList = () => {
    fetch(`${pathWay}/departments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(json => {
        json.data.forEach(department => {
            departmentArray.push(department);
        });
    });
}

module.exports = { startApp };