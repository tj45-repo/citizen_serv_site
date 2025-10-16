-- Databases
CREATE DATABASE IF NOT EXISTS birth_db   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS vehicle_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS housing_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Users + grants
CREATE USER IF NOT EXISTS 'birth_user'@'%' IDENTIFIED BY 'birth_pass';
CREATE USER IF NOT EXISTS 'vehicle_user'@'%' IDENTIFIED BY 'vehicle_pass';
CREATE USER IF NOT EXISTS 'housing_user'@'%' IDENTIFIED BY 'housing_pass';
GRANT ALL PRIVILEGES ON birth_db.*   TO 'birth_user'@'%';
GRANT ALL PRIVILEGES ON vehicle_db.* TO 'vehicle_user'@'%';
GRANT ALL PRIVILEGES ON housing_db.* TO 'housing_user'@'%';
FLUSH PRIVILEGES;

-- === Birth schema ===
USE birth_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS birth_applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  applicant_name VARCHAR(200) NOT NULL,
  date_of_birth DATE NOT NULL,
  place_of_birth VARCHAR(200) NOT NULL,
  father_name VARCHAR(200),
  mother_name VARCHAR(200),
  address TEXT,
  status ENUM('PENDING','APPROVED','REJECTED','PAID') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  application_id BIGINT NOT NULL,
  amount_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'AUD',
  provider_ref VARCHAR(64),
  status ENUM('INITIATED','PAID','FAILED','REFUNDED') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES birth_applications(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX (application_id)
);

-- === Vehicle schema ===
USE vehicle_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle_applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  plate_number VARCHAR(50) NOT NULL,
  vin VARCHAR(100) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  owner_name VARCHAR(200) NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED','PAID') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  application_id BIGINT NOT NULL,
  amount_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'AUD',
  provider_ref VARCHAR(64),
  status ENUM('INITIATED','PAID','FAILED','REFUNDED') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES vehicle_applications(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX (application_id)
);

-- === Housing schema ===
USE housing_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS housing_applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  applicant_name VARCHAR(200) NOT NULL,
  address VARCHAR(300) NOT NULL,
  household_size INT NOT NULL,
  income_band VARCHAR(100) NOT NULL,
  status ENUM('PENDING','APPROVED','REJECTED','PAID') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  application_id BIGINT NOT NULL,
  amount_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'AUD',
  provider_ref VARCHAR(64),
  status ENUM('INITIATED','PAID','FAILED','REFUNDED') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES housing_applications(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX (application_id)
);
