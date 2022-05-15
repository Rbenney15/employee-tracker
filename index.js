// Dependencies ---------------------------------------------------------------------------------------------------------------------------------------
const inquirer = require('inquirer')
const consoleTable = require('console.table');
const db = require('./db/connection');

const startPrompt = () => {
    console.log ('WELCOME TO THE EMPLOYEE DATABASE!');
    return inquirer
      .prompt({
          name: 'nav',
          message: 'Which section would you like to view?',
          type: 'list',
          choices: [
              "Departments",
              "Employees",
              "Roles",
              "[Exit]"
          ]
      })
      .then((choice) => {
          switch (choice.nav){
            case "Departments" :
              viewDepartmentSection();
              break;

            case "Employees" :
              viewEmployeeSection();
              break;
            
            case "Roles" :
              viewRoleSection();
              break;

            case "[Exit]" :
              console.log(`Goodbye!`);
              db.end();
              break;
        }
    });
};

// Department Functions/Navigation section----------------------------------------------------------------------------------------
const viewDepartmentSection = () => {
    console.log ('Departments');
    return inquirer
      .prompt({
          name: 'deptChoice',
          message: 'What would you like to do?',
          type: 'list',
          choices: [
              "View all departments",
              "Add a department",
              "Remove a department",
              "[Back]"
          ]
      })
      .then((choice) =>{
          switch (choice.deptChoice){
              case "View all departments" :
                  viewDepartments();
                  break;
              case "Add a department" :
                  addDepartment();
                  break;
              case "Remove a department" :
                  removeDepartment();
                  break;
              case "[Back]" :
                  startPrompt();
                  break; 
          }
      })
};

// View all Departments------------------------------------------------------------------------------------------
const viewDepartments = () => {
    const sql = `SELECT department.id AS ID, name AS Name FROM department`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        viewDepartmentSection();
    });
};

// Add department---------------------------------------------------------------------------------------------------------------------------------------
const addDepartment = () => {
    // prompt for new dept name, then insert into dept table
    return inquirer
      .prompt(
        {
          name: "deptName",
          message: "What is the new department's name?",
          validate: input => input ? true : "Department name is required."
        }
      )
      .then((answer) => {
          db.query(`
            INSERT INTO department SET ?`,
            { name: answer.deptName },
            (err, res) => {
              if (err) throw err;
              console.log(`${answer.deptName} department created`);
              // re-run function to view department table for verification, which then returns to department section nav
              viewDepartments();
            })
      });
};
// Remove a department---------------------------------------------------------------------------------------------------------------------------------------
const removeDepartment = () => {
    // empty array to hold department name
    let departmentName = [];
    // empty array to hold department name and id
    let departments = [];

    // pull all department names for prompt
    const deptQuery = `SELECT name, id FROM department`;
    db.query(deptQuery, (err, res) => {
        // loop through response, push to array
        for (var i = 0; i < res.length; i++) {
            departmentName.push(res[i].name);
            departments.push(res[i]);
        }

        // prompt to select which dept to remove
        return inquirer
        .prompt(
            {
                name: "deleteDept",
                message: "Which department would you like to delete?",
                type: "list",
                choices: departmentName
            }
        )
        .then((deptChoice) => {
            // get id based on name match
            departments.forEach((department) => {
                if (department.name === deptChoice.deleteDept) {
                    deptChoice.deleteDept = department.id;
                }
            });

            // remove from department table using id
            db.query(`DELETE FROM department WHERE ?`, 
                {id: deptChoice.deleteDept},
                (err, res) => {
                    if (err) throw err;
                    console.log(`Department deleted`);
                    // re-run show department table for verification, which then returns to dept section nav
                    viewDepartments();
                })
        });
    });  
};

// Role Functions and Navigation section--------------------------------------------------------------------------------------------------------
const viewRoleSection = () => {
    console.log('ROLES');
    return inquirer
    .prompt({
        name: 'roleChoice',
        message: 'What would you like to do?',
        type: 'list',
        choices: [
            "View all roles",
            "Add a role",
            "Remove a role",
            "[Back]"
        ]
    })
    .then((choice) =>{
        switch (choice.roleChoice){
            case "View all roles" :
                viewRoles();
                break;
            case "Add a role" :
                addRole();
                break;
            case "Remove a role" :
                removeRole();
                break;
            case "[Back]" :
                startPrompt();
                break; 
        }
    })
};

// View all roles---------------------------------------------------------------------------------------------------------------------------------------
const viewRoles = () => {
  db.query(`SELECT role.id AS ID, title AS Title, department.name AS Department, salary AS Salary 
          FROM role 
          LEFT JOIN department 
          ON role.department_id = department.id
         `, 
          (err, res) => {
            if (err) throw err;
            console.table(res);
            // return to role section
            viewRoleSection();
  });
};

// Add a role---------------------------------------------------------------------------------------------------------------------------------------
const addRole = () => {
  // empty array to hold department name
  let departmentName = [];

  // pull all department names for prompt
  const deptQuery = `SELECT name FROM department`;
  db.query(deptQuery, (err, res) => {
      // loop through response, push name value to array
      for (var i = 0; i < res.length; i++) {
          departmentName.push(res[i]);
      }
  });

  // prompt for new role name, salary, and department
  return inquirer
    .prompt([
      {
        name: "roleTitle",
        message: "What is the new role's title?",
        validate: input => input ? true : "Role title is required."
      },
      {
        name: "roleSalary",
        message: "What is the new role's salary?",
        validate: input => {
          if (isNaN(input) || input === "") {
              return "Salary is required AND must be a number";
          }
          return true;
          }
      },
      {
        name: "roleDept",
        message: "Which department does this role belong to?",
        type: 'list',
        choices: departmentName
      }
    ])
    .then((answer) => {
      let deptName = answer.roleDept;
      // get department id from answer
      let deptIdQuery = `SELECT id FROM department WHERE name = "${deptName}"`;

      db.query(deptIdQuery, (err, res) => {
          let deptId = res[0].id;
          if (err) throw err;

          // insert into role table using gathered values
          db.query(`
              INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
              [
                  answer.roleTitle, 
                  answer.roleSalary,
                  deptId
              ],
              (err, res) => {
              if (err) throw err;
              console.log(`Role created`);
              // re-run show role table for verification, which then returns to role section
              viewRoles();
              })
      });
  });
};

// Delete role---------------------------------------------------------------------------------------------------------------------------------------
const removeRole = () => {
  // empty array to hold role title value for selection
  let roleName = [];
  // empty array to hold role title and id
  let roles = [];

  // pull all role names for prompt
  const roleQuery = `SELECT title, id FROM role`;
  db.query(roleQuery, (err, res) => {
      // loop through response, push titles to array
      for (var i = 0; i < res.length; i++) {
          roleName.push(res[i].title);
          roles.push(res[i]);
      }

      // prompt to select which role to remove
      return inquirer
        .prompt(
            {
                name: "deleteRole",
                message: "Which role would you like to remove?",
                type: "list",
                choices: roleName
            }
        )
        .then((roleChoice) => {
            // get id based on title match
            roles.forEach((role) => {
                if (role.title === roleChoice.deleteRole) {
                    roleChoice.deleteRole = role.id;
                }
            });

            // remove from role table using id (safer than by title)
            db.query(`DELETE FROM role WHERE ?`,
              {id: roleChoice.deleteRole},
              (err, res) => {
                  if (err) throw err;
                  console.log(`Role deleted`);
                  // re-run show role table for verification, which then returns to role section nav
                  viewRoles();
              })
        });
  });
};

// Employee Functions and Navigation section ----------------------------------------------------------------------------------------------
const viewEmployeeSection = () => {
    console.log('EMPLOYEES')
    return inquirer
      .prompt({
          name: "employeeChoice",
          message: "What would you like to do?",
          type: "list",
          choices: [
              "View all employees",
              "Add new employee",
              "Remove an employee",
              "[Back]"
          ]
      })
      .then((choice) => {
          switch (choice.employeeChoice){
              case "View all employees" :
                  viewEmployees();
                  break;
              case "Add new employee" :
                  addEmployee();
                  break;
              case "Remove an employee" :
                  removeEmployee();
                   break;
              case "Update an employee's Role" :
                    updateEmpRole();
                    break;
              case "[Back]" :
                  startPrompt();
                  break;
          }
      })
};

// View all employees------------------------------------------------------------------------------------------
const viewEmployees = () => {
    const sql = `SELECT employee.id AS ID, 
                CONCAT(employee.first_name, " ", employee.last_name) AS Name, 
                role.title AS Role,
                role.salary AS Salary,
                department.name AS Department,
                CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee
                INNER JOIN role on role.id = employee.role_id 
                INNER JOIN department on department.id = role.department_id 
                LEFT JOIN employee e on employee.manager_id = e.id
                ORDER BY employee.id`
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        viewEmployeeSection();
    });
};

// Add employee ------------------------------------------------------------------------------------------
const addEmployee = () => {
    let managerName = ["None"];
    // array for full manager record (full name and id)
    let managers = [];
    // empty array to hold roles
    let roles = [];

    // pull all role titles for prompt
    let roleQuery = `SELECT title FROM role`;
    db.query(roleQuery, (err, res) => {
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
    });
    
    
    let managerQuery = `SELECT id, CONCAT(first_name, " ", last_name) 
    AS full_name
    FROM employee 
    WHERE manager_id IS NULL`;
    db.query(managerQuery, (err, res) => {
        for (var i = 0; i < res.length; i++) {
            managerName.push(res[i].full_name);
            managers.push(res[i]);
        }
    });
    
    // prompt for new employee full name, role (sets id), manager (sets id)
    return inquirer
    .prompt([
        {
            name: "employeeFirstName",
            message: "Employee's first name?",
            validate: input => input ? true : "First name is required"
        },
        {
            name: "employeeLastName",
            message: "Employee's last name?",
            validate: input => input ? true : "Last name is required"
        },
        {
            name: "employeeRole",
            message: "What is this employee's role?",
            type: "list",
            choices: roles
        },
        {
            name: "employeeManager",
            message: "Who is this employee's manager?",
            type: "list",
            choices: managerName
        }
    ])
    .then((answers) => {
        managers.forEach((manager) => {
            if (manager.full_name === answers.employeeManager) {
                answers.employeeManager = manager.id;
            } else if (answers.employeeManager === "None") {
                answers.employeeManager = null;
            }
        });
        
        // get role id from answer
        db.query(`SELECT id FROM role WHERE title = "${answers.employeeRole}"`, 
        (err, res) => {
            if (err) throw err;
            let empRoleId = res[0].id;

            // insert into table using gathered values
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES (?,?,?,?)`,
            [
                answers.employeeFirstName,
                answers.employeeLastName,
                empRoleId,
                answers.employeeManager
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`New employee added`);
                viewEmployees();
            });
        });
    });
};

// Delete employee-----------------------------------------------------------------------------------------------------
const removeEmployee = () => {
    let employeeName = [];
    let employees = [];
    
    // pull all employee names for prompt
    let empQuery = `SELECT id, CONCAT(first_name, " ", last_name)
    AS full_name
    FROM employee`;
    db.query(empQuery, (err, res) => {
        for (var i = 0; i < res.length; i++) {
            employeeName.push(res[i].full_name);
            employees.push(res[i]);
        }
        
        // prompt to select which employee to remove
        return inquirer
        .prompt({
            name: "deleteEmployee",
            message: "Which employee would you like to remove?",
            type: "list",
            choices: employeeName
        })
        .then((choice) => {
            // get id based on name match
            employees.forEach((employee) => {
                if (employee.full_name === choice.deleteEmployee) {
                    choice.deleteEmployee = employee.id;
                }
            });
            
            // remove from employee table using id
            db.query(`DELETE FROM employee WHERE ?`,
            { id: choice.deleteEmployee },
            (err, res) => {
                if (err) throw err;
                console.log(`Employee removed`);
                  viewEmployees();
                });
            });
    });
};
// Update an employee role------------------------------------------------------------------------------------------
const updateEmpRole = () => {
    let employeeName = [];
    let employees = [];
    let roleTitle = [];
    let roles = [];
  
  // pull employee records for prompt
  const empQuery = `SELECT id, CONCAT(first_name, " ", last_name)
  AS full_name
  FROM employee`;
  db.query(empQuery, (err, res) => {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
          employeeName.push(res[i].full_name);
          employees.push(res[i]);
        }
        
        // pull role records for prompt
        db.query(`SELECT id, title FROM role`, (err, res) => {
            for (var i = 0; i < res.length; i++) {
              roleTitle.push(res[i].title);
              roles.push(res[i]);
            }
        });

      // prompt for which employee and subsequent role to update
      return inquirer
        .prompt([
          {
              name: "employeeName",
              message: "Which employee would you like to update?",
              type: "list",
              choices: employeeName
            },
            {
                name: "newRole",
                message: "What is their new role?",
                type: "list",
                choices: roleTitle
            }
        ])
        .then((answers) => {
            // get employee's id by name match
            employees.forEach((employee) => {
                if (employee.full_name === answers.employeeName) {
                    answers.employeeName = employee.id;
                }
            });
            
            // get role id by title match
            roles.forEach((role) => {
                if (role.title === answers.newRole) {
                    answers.newRole = role.id;
                }
            });
            
            // query to update record using gathered values
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            db.query(sql,
                [
                    
                    answers.newRole,
                    answers.employeeName
                    
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log(`Employee role updated`);
                    viewEmployees();
                });
            });
        });
};
startPrompt();

module.exports = startPrompt;