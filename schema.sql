-- Create Database --
DROP DATABASE IF EXIST employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- Department Table --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

-- Department Table --
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Employee Role Table --
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Department Seeds --
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Legal");

-- Employee Role Seeds --
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 3);

-- Employee Seeds --
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Charles", "Wilson", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Howard", "Wheeler", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("George", "Baumes", null, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Rob", "Benney", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Chandler", "Vilander", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Donte", "Brown", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Eric", "Wiggins", 2, 7);

-- Selecting For Creating --
-- Tables in SQL
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;