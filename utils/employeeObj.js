
// employee constructor function
class Employee {
    constructor(firstName, lastName, role, rolesArray, manager, managersArray) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.rolesArray = rolesArray;
        this.manager = manager;
        this.managersArray = managersArray;
        this.roleId;
        this.managerId;
    }

    getRoleId() {
        this.rolesArray.forEach(role => {
            if (role.Title === this.role) {
                this.roleId = role.ID;
            }
        });
        return this.roleId;
    }
    
    getManagerId() {
        this.managersArray.forEach(obj => {
            if (this.manager === (obj.First_Name + ' ' + obj.Last_Name)) {
                this.managerId = obj.ID;
            }
        });
        return this.managerId;
    }
}

module.exports = Employee;