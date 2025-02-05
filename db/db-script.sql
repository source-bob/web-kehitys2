DROP DATABASE IF EXISTS HealthDiary;
CREATE DATABASE HealthDiary;
USE HealthDiary;

-- Create a table for country
CREATE TABLE Country (
    country_id      INT                 AUTO_INCREMENT PRIMARY KEY,
    country_name    VARCHAR(40)         NOT NULL UNIQUE,
    population      INT,
    description     TEXT
);

-- Create a table for location
CREATE TABLE City (
    city_id             INT             AUTO_INCREMENT PRIMARY KEY,
    city_name           VARCHAR(40)     NOT NULL UNIQUE,
    population          INT,
    country_id          INT,
    FOREIGN KEY (country_id) REFERENCES Country(country_id) ON DELETE SET NULL
);

-- Create a table for users
CREATE TABLE Users (
    user_id     INT             AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)     NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    email       VARCHAR(100)    NOT NULL UNIQUE,
    city_id     INT,
    created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id)     REFERENCES City(city_id) ON DELETE SET NULL
);

-- Create a table for diary entries
CREATE TABLE DiaryEntries (
    entry_id        INT               AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    entry_date      DATE              NOT NULL,
    mood            VARCHAR(50),
    weight          DECIMAL(5,2),
    sleep_hours     INT,
    notes           TEXT,
    created_at      DATETIME DEFAULT  CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES  Users(user_id) ON DELETE CASCADE
);