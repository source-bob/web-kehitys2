ALTER TABLE Users ADD COLUMN user_level VARCHAR(10) DEFAULT 'regular';

INSERT INTO country (country_name, population, DESCRIPTION)
VALUES 
("Finland", 6000000, "Scandinavian country"),
("Sweden", 10500000, "Scandinavian country");

INSERT INTO city (city_name, population, country_id)
VALUES 
("Helsinki", 657000, 1),
("Espoo", 293000, 1),
("Vantaa", 237000, 1);

INSERT INTO Users VALUES (1, 'johndoe', 'temp-pw-1', 'johndoe@example.com', 1, '2024-01-02 10:00:00', 'regular');

INSERT INTO Users (username, password, email, city_id, user_level) VALUES
  ('janedoe', 'temp-pw-2', 'janedoe@example.com', 1, 'admin'),
  ('mike_smith', 'temp-pw-3', 'mike@example.com', 2, 'moderator'),
  ('bob', 'bobspass', 'bob@example.com', 2, 'regular');


INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes, created_at) VALUES
  (3, '2024-01-10', 'Happy', 70.5, 8, 'Had a great day, felt energetic', '2024-01-10 20:00:00');

INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes, created_at) VALUES
  (1, '2024-01-10', 'Happy', 70.5, 8, 'Had a great day, felt energetic', '2024-01-10 20:00:00'),
  (1, '2024-01-11', 'Tired', 70.2, 6, 'Long day at work, need rest', '2024-01-11 20:00:00'),
  (2, '2024-01-10', 'Stressed', 65.0, 7, 'Busy day, a bit stressed out', '2024-01-10 21:00:00');
  
UPDATE users SET city_id = 1 WHERE user_id = 4;

SELECT username, city.city_name FROM users
JOIN city ON city.city_id = users.city_id
WHERE users.city_id = 1;

DELETE FROM city WHERE city_id = 3;