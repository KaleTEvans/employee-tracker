const inquirer = require('inquirer');
const fetch = require('node-fetch');
const cTable = require('console.table');
const { response } = require('express');

const Employee = require('./utils/employeeObj');
const EmployeeUpdate = require('./utils/employeeUpdate');
const pathWay = 'http://localhost:3001/api';
const departmentArray = [];
let roleArray = [];
let rolesArray = [];
let managerArray = [];
let managersArray = [];


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
            roleList();
            managerList();
            inquirer.prompt([
                {
                    type: 'text',
                    name: 'firstName',
                    message: 'Enter the first name of the employee',
                    validate: firstName => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log('Please enter the first name');
                            return false;
                        }
                    }
                },
                {
                    type: 'text',
                    name: 'lastName',
                    message: 'Enter the last name of the employee',
                    validate: lastName => {
                        if (lastName) {
                            return true;
                        } else {
                            console.log('Please enter a last name');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the role of the employee',
                    choices: roleArray
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select the manager of the employee',
                    choices: managerArray
                }
            ]).then(({ firstName, lastName, role, manager }) => {
                let employee = new Employee(firstName, lastName, role, rolesArray, manager, managersArray);
                employeeAdd(firstName, lastName, employee.getRoleId(), employee.getManagerId());
            })
        }
        if (optionSelect === 'Update an employee role') {
            managerList();
            roleList();
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'updateConfirm',
                    message: 'Are you sure you would like to change the role of an employee?',
                    default: true
                },
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select the employee you would like to update',
                    choices: managerArray
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the new role',
                    choices: roleArray
                }
            ]).then(({ employee, role }) => {
                let newRole = new EmployeeUpdate(employee, role, managersArray, rolesArray)
                employeeUpdate(newRole.getEmployeeId(), newRole.getRoleId());
            })
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

const employeeAdd = (firstName, lastName, roleId, managerId) => {
    (async () => {
        const rawResponse = await fetch(`${pathWay}/employee`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: managerId
            })
        });
        const content = await rawResponse.json();

        console.log(`${content.data.first_name} ${content.data.last_name} added to Employees`);
    })().then(portalFunction)
};

const employeeUpdate = (employeeId, roleId) => {
    (async () => {
        const rawResponse = await fetch(`${pathWay}/employee/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role_id: roleId
            })
        });
    const content = await rawResponse.json();

    console.log(`Role Updated`);
    })().then(portalFunction)
}



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
    })
};

const roleList = () => {
    fetch(`${pathWay}/roles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res=> res.json())
    .then(json => {
        json.data.forEach(role => {
            roleArray.push(role.Title);
            rolesArray.push(role);
        })
    })
};

const managerList = () => {
    fetch(`${pathWay}/employees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json())
    .then(json => {
        json.data.forEach(employee => {
            managerArray.push(employee.First_Name + ' ' + employee.Last_Name);
            managersArray.push(employee);
        })
    })
}

module.exports = { startApp };