/*
 * Script for creating the forum database
 *
 * WARNING!  Running this script will delete all tables in the myforum database and recreate them.
 *           Any existing data will be lost!
 */

# Make sure the databese is created before you run this script
#     
CREATE DATABASE astroCollective;

USE astroCollective;

DROP USER IF EXISTS 'astroappuser'@'localhost';
CREATE USER 'astroappuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'milkyway';
GRANT ALL PRIVILEGES ON astroCollective.* TO 'astroappuser'@'localhost';      

DROP TABLE IF EXISTS user_details;
CREATE TABLE user_details (
  user_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  firstname VARCHAR(60) NOT NULL,
  surname VARCHAR(60) NOT NULL,
  username VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  hashedPassword VARCHAR(60) NOT NULL,
  PRIMARY KEY(user_id)
);

DROP TABLE IF EXISTS astronauts;
CREATE TABLE astronauts (
  astronaut_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  astronaut_name VARCHAR(150) NOT NULL,
  astronaut_photo VARCHAR(500),
  date_of_birth DATE,
  date_of_death DATE,
  country VARCHAR(60),
  hours_in_space DECIMAL(6, 1),
  astronaut_profile VARCHAR(5000),
  PRIMARY KEY(astronaut_id)
);

DROP TABLE IF EXISTS missions;
CREATE TABLE missions (
  mission_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  mission_name VARCHAR(200),
  launch_date DATE,
  return_date DATE,
  launch_location VARCHAR(100),
  space_agency VARCHAR(100),
  spacecraft VARCHAR(100),
  mission_insignia VARCHAR(500),
  mission_details VARCHAR(5000),
  PRIMARY KEY(mission_id)
);

DROP TABLE IF EXISTS spacecraft;
CREATE TABLE spacecraft (
  craft_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  craft_name VARCHAR(200),
  craft_photo VARCHAR(500),
  craft_status ENUM('Active', 'Retired', 'Destroyed'),
  craft_launches INT(100),
  craft_details VARCHAR(5000),
  PRIMARY KEY(craft_id)
);