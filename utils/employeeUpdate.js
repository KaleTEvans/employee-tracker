class EmployeeUpdate {
    constructor (employee, role, employeeArray, rolesArray) {
        this.employee = employee;
        this.role = role;
        this.employeeArray = employeeArray;
        this.rolesArray = rolesArray;
        this.employeeId;
        this.roleId;

    }

    getEmployeeId() {
        this.employeeArray.forEach(employee => {
            if (this.employee === (employee.First_Name + ' ' + employee.Last_Name)) {
                this.employeeId = employee.ID;
            }
        })
        return this.employeeId;
    }

    getRoleId() {
        this.rolesArray.forEach(newRole => {
            if (this.role === newRole.Title) {
                this.roleId = newRole.ID;
            }
        });
        return this.roleId;
    }
}

module.exports = EmployeeUpdate;