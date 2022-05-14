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
CREATE TABLE role (

);

-- Department Seeds --

-- Employee Role Seeds --

-- Employee Seeds --

-- Selecting For Creating --
-- Tables in SQL
SELECT * FROM ;
SELECT * FROM ;
SELECT * FROM ;