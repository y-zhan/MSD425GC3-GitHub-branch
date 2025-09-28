CREATE DATABASE library_system;

USE library_system;

CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,   
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  status ENUM('active','suspended','blacklisted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Users (name, email, password, role, status) VALUES
('Zach Admin', 'zach@library.com', 'adminhash1', 'admin', 'active'),
('Emma Admin', 'emma@library.com', 'adminhash2', 'admin', 'active');
SELECT * FROM Users;

CREATE TABLE Books (
  book_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100),
  category VARCHAR(50),
  description TEXT,
  publish_year YEAR,
  publisher VARCHAR(100),
  cover_image VARCHAR(255) NOT NULL,   
  ebook_link VARCHAR(255) NOT NULL,  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Books (title, author, category, description, publish_year, publisher, cover_image, ebook_link)
VALUES
('Clean Code', 'Robert C. Martin', 'Software Engineering', 'A handbook of agile software craftsmanship.', 2008, 'Prentice Hall',
 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg',
 'https://archive.org/details/cleancodehandboo00mart'),
 
('Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 'Widely used textbook on algorithms.', 2009, 'MIT Press',
 'https://images-na.ssl-images-amazon.com/images/I/41SNcYQXQQL._SX379_BO1,204,203,200_.jpg',
 'https://archive.org/details/IntroductionToAlgorithms_201810'),
 
('Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', 'Artificial Intelligence', 'Classic AI textbook.', 2010, 'Pearson',
 'https://m.media-amazon.com/images/I/51lr4l9c2eL._SX379_BO1,204,203,200_.jpg',
 'https://archive.org/details/artificialintelligence3rdedition'),
 
('Database System Concepts', 'Abraham Silberschatz', 'Database', 'Standard database systems textbook.', 2020, 'McGraw-Hill',
 'https://m.media-amazon.com/images/I/41sNbmZ7lUL._SX379_BO1,204,203,200_.jpg',
 'https://archive.org/details/DatabaseSystemConcepts7th'),
 
('Operating System Concepts', 'Abraham Silberschatz', 'Computer Science', 'Comprehensive OS textbook.', 2018, 'Wiley',
 'https://m.media-amazon.com/images/I/41H1mrj3XDL._SX379_BO1,204,203,200_.jpg',
 'https://archive.org/details/OperatingSystemConcepts10th'),
 
('Computer Networking: A Top-Down Approach', 'James F. Kurose, Keith W. Ross', 'Computer Networks', 'Networking concepts with examples.', 2017, 'Pearson',
 'https://m.media-amazon.com/images/I/51zQ8m1M9DL._SX379_BO1,204,203,200_.jpg',
 'https://archive.org/details/ComputerNetworkingATopDownApproach7th'),
 
('Deep Learning', 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', 'Artificial Intelligence', 'Comprehensive deep learning book.', 2016, 'MIT Press',
 'https://m.media-amazon.com/images/I/51H17R2aRJL._SX379_BO1,204,203,200_.jpg',
 'https://www.deeplearningbook.org/'),
 
('Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Software Engineering', 'The classic GoF design patterns book.', 1994, 'Addison-Wesley',
 'https://m.media-amazon.com/images/I/51kuc0iWoRL._SX379_BO1,204,203,200_.jpg',
 'https://archive.org/details/DesignPatternsBook'),
 
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fiction', 'The first Harry Potter novel.', 1997, 'Bloomsbury',
 'https://m.media-amazon.com/images/I/51UoqRAxwEL._SX331_BO1,204,203,200_.jpg',
 'https://archive.org/details/harrypottersorce00rowl'),
 
('The Pragmatic Programmer', 'Andrew Hunt, David Thomas', 'Software Engineering', 'Practical tips for software developers.', 1999, 'Addison-Wesley',
 'https://m.media-amazon.com/images/I/518FqJvR9aL._SX377_BO1,204,203,200_.jpg',
 'https://archive.org/details/pragmaticprogrammer20thanniversary'),
 
 ('Structure and Interpretation of Computer Programs', 'Harold Abelson, Gerald Jay Sussman', 'Computer Science',
 'A foundational computer science textbook using Scheme.', 1996, 'MIT Press',
 'https://m.media-amazon.com/images/I/41kF2W7V6jL._SX331_BO1,204,203,200_.jpg',
 'https://archive.org/details/StructureAndInterpretationOfComputerPrograms'),
 
('You Don''t Know JS: Scope & Closures', 'Kyle Simpson', 'JavaScript',
 'Deep dive into JavaScript scope and closures.', 2014, 'O''Reilly Media',
 'https://m.media-amazon.com/images/I/41vU1kXvJGL._SX331_BO1,204,203,200_.jpg',
 'https://archive.org/details/YouDontKnowJSYDKJS'),
 
('Refactoring: Improving the Design of Existing Code', 'Martin Fowler', 'Software Engineering',
 'Techniques for refactoring code for maintainability.', 1999, 'Addison-Wesley',
 'https://m.media-amazon.com/images/I/41jEbK-jG+L._SX396_BO1,204,203,200_.jpg',
 'https://archive.org/details/RefactoringImprovingTheDesignOfExistingCode'),
 
('Compilers: Principles, Techniques, and Tools', 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman', 'Computer Science',
 'Known as the Dragon Book, classic text on compilers.', 2006, 'Pearson',
 'https://m.media-amazon.com/images/I/51F5v67QFZL._SX396_BO1,204,203,200_.jpg',
 'https://archive.org/details/CompilersPrinciplesTechniquesAndTools2ndEd'),
 
('Code Complete', 'Steve McConnell', 'Software Engineering',
 'Comprehensive guide to software construction.', 2004, 'Microsoft Press',
 'https://m.media-amazon.com/images/I/51b7XbfMIIL._SX396_BO1,204,203,200_.jpg',
 'https://archive.org/details/CodeComplete2ndEdition'),
 
('The Mythical Man-Month', 'Frederick P. Brooks Jr.', 'Software Engineering',
 'Classic essays on software project management.', 1995, 'Addison-Wesley',
 'https://m.media-amazon.com/images/I/41H+3dpH1hL._SX331_BO1,204,203,200_.jpg',
 'https://archive.org/details/mythicalmanmonth00broo'),
 
('Head First Design Patterns', 'Eric Freeman, Elisabeth Robson, Bert Bates, Kathy Sierra', 'Software Engineering',
 'Fun introduction to design patterns in software.', 2004, 'O''Reilly Media',
 'https://m.media-amazon.com/images/I/51szD3j8ZKL._SX430_BO1,204,203,200_.jpg',
 'https://archive.org/details/HeadFirstDesignPatterns'),
 
('The Art of Computer Programming, Vol. 1', 'Donald E. Knuth', 'Computer Science',
 'Foundational algorithms and programming text.', 1997, 'Addison-Wesley',
 'https://m.media-amazon.com/images/I/41as+WafrFL._SX342_SY445_QL70_ML2_.jpg',
 'https://archive.org/details/TheArtOfComputerProgrammingVol1'),
 
('Cracking the Coding Interview', 'Gayle Laakmann McDowell', 'Interview Prep',
 'Popular coding interview preparation book.', 2015, 'CareerCup',
 'https://m.media-amazon.com/images/I/41-sN-mzwKL._SX348_BO1,204,203,200_.jpg',
 'https://archive.org/details/CrackingTheCodingInterview6thEdition189ProgrammingQuestionsAndSolutions'),
 
('Designing Data-Intensive Applications', 'Martin Kleppmann', 'Data Engineering',
 'Modern architectures for scalable and reliable systems.', 2017, 'O''Reilly Media',
 'https://m.media-amazon.com/images/I/41W+Kxkq6gL._SX379_BO1,204,203,200_.jpg',
 'https://archive.org/details/DesigningDataIntensiveApplications');

SELECT * FROM Books;

-- These are trash scripts
CREATE TABLE Borrows (
  borrow_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE DEFAULT NULL,
  status ENUM('borrowed','returned') DEFAULT 'borrowed',
  FOREIGN KEY (student_id) REFERENCES Users(user_id),
  FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

INSERT INTO Borrows (student_id, book_id, borrow_date, due_date, status)
VALUES 
(12, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'borrowed'), 
(13, 3, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'borrowed'), 
(14, 5, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'borrowed'),  
(15, 7, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'borrowed');  

SELECT u.name, b.title, br.borrow_date, br.due_date, br.status
FROM Borrows br
JOIN Users u ON br.student_id = u.user_id
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id IN (12, 13, 14, 15);

INSERT INTO Borrows (student_id, book_id, borrow_date, due_date, status)
VALUES (1, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'borrowed');

SELECT b.title, br.borrow_date, br.due_date, br.status
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id = 1 AND br.status = 'borrowed';

UPDATE Borrows
SET status = 'returned', return_date = CURDATE()
WHERE borrow_id = 1 AND student_id = 1;

SELECT u.name, u.email, b.title, br.due_date
FROM Borrows br
JOIN Users u ON br.student_id = u.user_id
JOIN Books b ON br.book_id = b.book_id
WHERE br.status = 'borrowed' AND br.due_date < CURDATE();

SELECT u.name, br.borrow_date, br.return_date, br.status
FROM Borrows br
JOIN Users u ON br.student_id = u.user_id
WHERE br.book_id = 1;

SELECT u.name, b.title, br.due_date
FROM Borrows br
JOIN Users u ON br.student_id = u.user_id
JOIN Books b ON br.book_id = b.book_id
WHERE br.status = 'borrowed'
  AND br.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY);

CREATE TABLE Reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  student_id INT NOT NULL,
  rating INT CHECK(rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES Books(book_id),
  FOREIGN KEY (student_id) REFERENCES Users(user_id)
);

CREATE TABLE Wishlist (
  wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  book_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Users(user_id),
  FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

CREATE TABLE Reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  student_id INT NOT NULL,
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending','notified','cancelled') DEFAULT 'pending',
  FOREIGN KEY (book_id) REFERENCES Books(book_id),
  FOREIGN KEY (student_id) REFERENCES Users(user_id)
);

CREATE TABLE Notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Fines (
  fine_id INT AUTO_INCREMENT PRIMARY KEY,
  borrow_id INT NOT NULL,
  amount DECIMAL(5,2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (borrow_id) REFERENCES Borrows(borrow_id)
);

CREATE TABLE Announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

SELECT * FROM Books;

INSERT INTO Reviews (book_id, student_id, rating, review_text) VALUES
(1, 1, 5,'Before reading Clean Code, my projects were a mess. This book opened my eyes to writing code that not only works, but is readable and maintainable. I especially loved the examples of refactoring—it felt like a masterclass. Definitely a must-read for any aspiring software engineer.' ),
(2, 12, 4, 'Introduction to Algorithms is comprehensive and detailed, but also overwhelming at times. As a student, I found some proofs tough to follow. However, once I understood the basics, the pseudocode was extremely helpful for learning data structures and algorithms in depth.'),
(7, 13, 5, 'Deep Learning by Goodfellow became my bible during my AI course. The math was heavy, but the way it connected neural network theory with practical examples gave me confidence. I used concepts from this book directly in my thesis project and it really impressed my supervisor.'),
(9, 14, 5, 'Harry Potter was my first experience with English novels. The magic, the story, the characters—everything felt so immersive. This was not just a book but an escape from reality. Even though our system is about e-books, this one always brings me joy.'),
(10, 15, 3, 'The Pragmatic Programmer is full of tips, but I feel some of them are just common sense. That said, the “Don’t Repeat Yourself” principle stuck with me and helped reduce redundancy in my group assignments. Not a life-changing book, but still useful.'),
(13, 16, 4, 'Refactoring by Martin Fowler showed me how to transform ugly code into clean structures without breaking functionality. During my internship, I applied these techniques in a live project and my mentor was impressed. A challenging but rewarding read.'),
(14, 17, 2, 'Compilers was incredibly dense. I honestly struggled through most chapters. It is clearly an important academic book, but unless you are deep into systems programming, you may find it too advanced. I could only get value by reading with a study group.'),
(16, 18, 5, 'The Mythical Man-Month was written decades ago, but surprisingly relevant. The idea that adding manpower to a late project makes it later really resonated with me, especially after my experience in group assignments.'),
(18, 19, 5, 'Knuth’s Art of Computer Programming is like the holy grail. Honestly, I can’t claim to have read it cover-to-cover, but the parts I studied (like sorting algorithms) were gold. Even if you read small sections, you will gain incredible insight.'),
(20, 20, 4, 'Designing Data-Intensive Applications was a tough read, but it helped me understand distributed systems. I now finally understand how databases, queues, and stream processing systems fit together. A must-read for backend engineers.');


INSERT INTO Reviews (book_id, student_id, rating, review_text) VALUES
(1, 12 , 4, 'Clean Code improved my assignments, though I don’t agree with every rule. Still, a must-have guide.'),
(1, 13 , 5, 'Applied Clean Code while tutoring juniors—helped them debug much faster.'),
(9, 16, 5 , 'Harry Potter was my first English novel, it made studying feel magical.'),
(9, 17, 4 , 'Great escape from coursework stress, but e-book formatting could be better.'),
(2, 18,  5 , 'Dynamic programming chapter saved me in a coding competition.'),
(2, 19, 3 , 'Tough book, needed online lectures to supplement, but worth it.'),
(16, 14, 4, 'Timeless lessons on project management. Group work delays finally made sense.'),
(16, 15, 5, 'Adding manpower makes a project later—so true for our class project.'),
(16, 12, 3, 'Some chapters dragged on, but it’s a classic nonetheless.');

SELECT * FROM Reviews;

INSERT INTO Wishlist (student_id, book_id) VALUES
(1, 7),
(12, 20),
(13, 9),
(14, 16),
(15, 1),
(16, 18),
(17, 13),
(18, 10),
(19, 5),
(1, 11);

SELECT * FROM Books;

INSERT INTO Reservations (book_id, student_id, status) VALUES
(3, 1, 'pending'),
(5, 12, 'notified'),
(7, 13, 'cancelled'), 
(14,14, 'pending'),
(18, 15, 'pending');  

SELECT * FROM Reservations;

INSERT INTO Notifications (user_id, message, is_read) VALUES
(1, 'Your reservation for "AI: A Modern Approach" is confirmed.', FALSE),
(12, 'The book "Operating System Concepts" is now available.', TRUE),
(13, 'Reminder: Your borrowed book is due in 3 days.', FALSE),
(15, 'Overdue notice: Please return "Harry Potter" immediately.', FALSE),
(16, 'Your review for "Refactoring" has been published.', TRUE);

SELECT * FROM Notifications;

INSERT INTO Fines (borrow_id, amount, paid) VALUES
(12 , 5.00, TRUE), -- Bob has paid the fine
(13, 1.75,FALSE), -- Charlie's payment is late
(14, 3.00 ,TRUE), -- Diana has paid
(15, 0.50, FALSE);  -- Ethan has a small outstanding balance

SELECT * FROM Fines;

SELECT * FROM Users;

INSERT INTO Announcements (admin_id, message) VALUES
(21, 'New e-books on Machine Learning have been added to the library.'),
(22, 'Scheduled maintenance on Sunday 10 PM - 12 AM, system may be unavailable.'),
(21, 'Reminder: Please return overdue books to avoid fines.'),
(22, 'We are launching a new "Top Rated Books" feature next month!');

SELECT * FROM Announcements;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Borrows;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Wishlist;
DROP TABLE IF EXISTS Reservations;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS Fines;
DROP TABLE IF EXISTS Announcements;

SET FOREIGN_KEY_CHECKS = 1;

-- Delect all gave done

-- Start new borrows

 CREATE TABLE Borrows (
  borrow_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE DEFAULT NULL,
  status ENUM('borrowed','returned') DEFAULT 'borrowed',
  fine_amount DECIMAL(5,2) DEFAULT 0.00,
  FOREIGN KEY (student_id) REFERENCES Users(user_id),
  FOREIGN KEY (book_id) REFERENCES Books(book_id)
);

-- Alice and Bob's borrowing history
-- =============================================
-- Insert 20 realistic borrow records for testing
-- Today = 2025-09-26
-- Demo date = 2025-10-13
-- Alice = student_id = 1
-- Bob   = student_id = 12
-- =============================================
USE library_system;
INSERT INTO Borrows (student_id, book_id, borrow_date, due_date, return_date, status, fine_amount)
VALUES
-- ========== Alice’s 15 records ==========
-- 1. Returned on time
(1, 1, '2025-08-20', '2025-09-03', '2025-09-02', 'returned', 0.00),
-- 2. Returned late (should trigger fine)
(1, 2, '2025-08-25', '2025-09-08', '2025-09-15', 'returned', 2.50),
-- 3. Still borrowed, due before demo (will appear in "about to expire")
(1, 3, '2025-09-20', '2025-10-04', NULL, 'borrowed', 0.00),
-- 4. Overdue at demo time (due before 2025-10-13)
(1, 4, '2025-09-10', '2025-09-24', NULL, 'borrowed', 5.00),
-- 5. Returned on time
(1, 5, '2025-08-30', '2025-09-13', '2025-09-12', 'returned', 0.00),
-- 6. Borrowed, will expire right around demo date
(1, 6, '2025-09-29', '2025-10-13', NULL, 'borrowed', 0.00),
-- 7. Borrowed, expires after demo (safe)
(1, 7, '2025-09-29', '2025-10-20', NULL, 'borrowed', 0.00),
-- 8. Returned late with fine
(1, 8, '2025-08-15', '2025-08-29', '2025-09-10', 'returned', 3.00),
-- 9. Returned on time
(1, 9, '2025-09-01', '2025-09-15', '2025-09-14', 'returned', 0.00),
-- 10. Borrowed, overdue at demo
(1, 10, '2025-09-05', '2025-09-19', NULL, 'borrowed', 4.00),
-- 11. Returned very late
(1, 11, '2025-08-01', '2025-08-15', '2025-09-01', 'returned', 6.00),
-- 12. Borrowed, expires 2 days before demo
(1, 12, '2025-09-22', '2025-10-11', NULL, 'borrowed', 0.00),
-- 13. Borrowed, expires the day after demo
(1, 13, '2025-09-25', '2025-10-14', NULL, 'borrowed', 0.00),
-- 14. Returned on time
(1, 14, '2025-09-01', '2025-09-15', '2025-09-13', 'returned', 0.00),
-- 15. Borrowed, long loan still active
(1, 15, '2025-09-10', '2025-10-25', NULL, 'borrowed', 0.00),

-- ========== Bob’s 5 records ==========
-- 16. Returned on time
(12, 16, '2025-08-18', '2025-09-01', '2025-08-30', 'returned', 0.00),
-- 17. Returned late with fine
(12, 17, '2025-08-25', '2025-09-08', '2025-09-12', 'returned', 2.00),
-- 18. Currently borrowed, will expire 1 day before demo
(12, 18, '2025-09-20', '2025-10-12', NULL, 'borrowed', 0.00),
-- 19. Overdue at demo
(12, 19, '2025-09-01', '2025-09-20', NULL, 'borrowed', 3.50),
-- 20. Active borrow, expires well after demo
(12, 20, '2025-09-25', '2025-10-25', NULL, 'borrowed', 0.00);

 -- Student_id = 1 ( Alice )
-- Alice's personal information
SELECT user_id, name, email, status
FROM Users
WHERE user_id = 1;

-- Books borrowed is reading
SELECT b.title, b.author, br.borrow_date, br.due_date
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id = 1
  AND br.status = 'borrowed'
  AND br.return_date IS NULL;

-- Alice's books out of date(include fine)
SELECT b.title, br.due_date, br.fine_amount
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id = 1
  AND br.status = 'borrowed'
  AND br.due_date < CURDATE();
  
-- Alice's totle fines
SELECT SUM(fine_amount) AS total_fine
FROM Borrows
WHERE student_id = 1
  AND status = 'borrowed'
  AND due_date < CURDATE();
  
-- Alice' booking history
SELECT b.title, br.borrow_date, br.due_date, br.return_date, br.status, br.fine_amount
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id = 1
ORDER BY br.borrow_date DESC;

-- Student_id = 12 (Bob)
-- View Bob's profile
SELECT user_id, name, email, status
FROM Users
WHERE user_id = 12;

-- View the books Bob is borrowing (not returned)
SELECT b.title, b.author, br.borrow_date, br.due_date
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id = 12
  AND br.status = 'borrowed'
  AND br.return_date IS NULL;

-- View Bob's overdue books (including fines)
SELECT b.title, br.due_date, br.fine_amount
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id = 12
  AND br.status = 'borrowed'
  AND br.due_date < CURDATE();

-- Calculate Bob's total penalty
SELECT SUM(fine_amount) AS total_fine
FROM Borrows
WHERE student_id = 12
  AND status = 'borrowed'
  AND due_date < CURDATE();

-- View Bob's borrowing history (including returned items and fines)
SELECT b.title, br.borrow_date, br.due_date, br.return_date, br.status, br.fine_amount
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.student_id = 12
ORDER BY br.borrow_date DESC;

-- Admin 
-- View all student information
SELECT user_id, name, email, status
FROM Users
WHERE role = 'student';

-- View all book information
SELECT book_id, title, author, publish_year
FROM Books;

-- Query the most popular books recently (most borrowed)
SELECT b.title, COUNT(br.borrow_id) AS borrow_count
FROM Borrows br
JOIN Books b ON br.book_id = b.book_id
WHERE br.borrow_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY b.title
ORDER BY borrow_count DESC
LIMIT 10;

-- Check overdue students and fines
SELECT u.user_id, u.name, u.email, b.title, br.due_date, br.fine_amount
FROM Borrows br
JOIN Users u ON br.student_id = u.user_id
JOIN Books b ON br.book_id = b.book_id
WHERE br.status = 'borrowed'
  AND br.due_date < CURDATE();
  
-- Create a table called "Announcements"
USE library_system;

CREATE TABLE Announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

-- insert information into Announcements
USE library_system;
INSERT INTO Announcements (admin_id, message) VALUES
(21, 'Reminder: All overdue books must be returned before October 10th.'),
(21, 'New arrivals this week: Cloud Computing and AI textbooks.'),
(22, 'Library system will undergo maintenance on October 5th, 2-4 PM.'),
(22, 'Please update your contact information in your student profile.');

-- select Announcements
SELECT a.announcement_id, a.message, a.created_at, u.name AS admin_name
FROM Announcements a
JOIN Users u ON a.admin_id = u.user_id
ORDER BY a.created_at DESC;

-- Add more testing datas
USE library_system;

INSERT INTO Borrows (student_id, book_id, borrow_date, due_date, return_date, status, fine_amount)
VALUES
-- === Charlie (id=13): mix of returned and overdue ===
(13, 1, '2025-08-10', '2025-08-24', '2025-08-22', 'returned', 0.00),
(13, 2, '2025-09-01', '2025-09-15', NULL, 'borrowed', 3.00), -- overdue at demo
(13, 3, '2025-09-20', '2025-10-05', NULL, 'borrowed', 0.00), -- active

-- === Diana (id=14): mostly returned on time ===
(14, 4, '2025-08-15', '2025-08-29', '2025-08-28', 'returned', 0.00),
(14, 5, '2025-09-05', '2025-09-19', '2025-09-25', 'returned', 2.50), -- returned late
(14, 6, '2025-09-22', '2025-10-10', NULL, 'borrowed', 0.00), -- expires before demo

-- === Ethan (id=15): multiple overdue ===
(15, 7, '2025-09-01', '2025-09-14', NULL, 'borrowed', 4.00),
(15, 8, '2025-09-10', '2025-09-24', NULL, 'borrowed', 5.00),

-- === Fiona (id=16): mix of behaviors ===
(16, 9, '2025-08-20', '2025-09-03', '2025-09-02', 'returned', 0.00),
(16, 10, '2025-09-15', '2025-09-29', '2025-10-05', 'returned', 2.00), -- late
(16, 11, '2025-09-20', '2025-10-04', NULL, 'borrowed', 0.00),

-- === George (id=17): safe borrowings ===
(17, 12, '2025-09-22', '2025-10-12', NULL, 'borrowed', 0.00),
(17, 13, '2025-09-25', '2025-10-18', NULL, 'borrowed', 0.00),

-- === Hannah (id=18): test multiple returns ===
(18, 14, '2025-08-05', '2025-08-19', '2025-08-15', 'returned', 0.00),
(18, 15, '2025-08-25', '2025-09-08', '2025-09-20', 'returned', 3.00), -- late
(18, 16, '2025-09-28', '2025-10-15', NULL, 'borrowed', 0.00),

-- === Isaac (id=19): overdue + current ===
(19, 17, '2025-09-05', '2025-09-19', NULL, 'borrowed', 4.50),
(19, 18, '2025-09-22', '2025-10-07', NULL, 'borrowed', 0.00),

-- === Julia (id=20): safe long borrow ===
(20, 19, '2025-09-10', '2025-10-25', NULL, 'borrowed', 0.00),
(20, 20, '2025-09-12', '2025-09-26', '2025-09-26', 'returned', 0.00);




  













