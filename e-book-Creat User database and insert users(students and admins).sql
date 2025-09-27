CREATE DATABASE library_system;

-- Create a system called library_system
USE library_system;

-- Create a table named Users (include students and admins)
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,   
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  status ENUM('active','suspended','blacklisted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- insert information about students and admins (name, email)         
INSERT INTO Users (name, email, password, role, status) VALUES
('Zach Admin', 'zach@library.com', 'adminhash1', 'admin', 'active'),
('Emma Admin', 'emma@library.com', 'adminhash2', 'admin', 'active');
SELECT * FROM Users;