
-- user creation example, replace 'user' and 'password'
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON 'Healthdiary'.* TO 'user'@'localhost';
FLUSH PREVILEGES;