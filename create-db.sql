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
  firstname VARCHAR(20) NOT NULL,
  surname VARCHAR(20) NOT NULL,
  username VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(60) NOT NULL,
  hashedPassword VARCHAR(60) NOT NULL,
  PRIMARY KEY(user_id)
);