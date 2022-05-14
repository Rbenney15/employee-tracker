USE employee_db;

-- Department Seeds --
INSERT INTO department (name)
VALUE
("Sales"),
("Engineering"),
("Finance"),
("Legal");

-- Employee Role Seeds --
INSERT INTO role (title, salary, department_id)
VALUE 
("Software Engineer", 120000, 2),
("Lead Engineer", 150000, 2),
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4),
("Accountant", 125000, 3);

-- Employee Seeds --
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE 
("Charles", "Wilson", NULL, 1),
("Howard", "Wheeler", NULL, 2),
("George", "Baumes", NULL, 3),
("Rob", "Benney", 1, 4),
("Chandler", "Vilander", 4, 5),
("Donte", "Brown", 1, 6),
("Eric", "Wiggins", 2, 7);