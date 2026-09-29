CREATE DATABASE IF NOT EXISTS bfar_caraga_db;
USE bfar_caraga_db;

-- 1. Geographic Hierarchy
CREATE TABLE IF NOT EXISTS geographic_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    region VARCHAR(100) DEFAULT 'Region XIII (Caraga)',
    province VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    coastal_type ENUM('Coastal', 'Landlocked') DEFAULT 'Coastal',
    fishing_area_name VARCHAR(150),
    management_area VARCHAR(100)
);

-- 2 & 3. Fisherfolk Master Profile & Registration
CREATE TABLE IF NOT EXISTS fisherfolk (
    fisherfolk_id VARCHAR(50) PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    extension_name VARCHAR(10),
    sex ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    civil_status VARCHAR(20),
    contact_number VARCHAR(20),
    location_id INT,
    household_members_count INT DEFAULT 1,
    primary_occupation VARCHAR(100),
    secondary_occupation VARCHAR(100),
    primary_livelihood_source VARCHAR(100),
    secondary_livelihood_source VARCHAR(100),
    rsbsa_status BOOLEAN DEFAULT FALSE,
    rsbsa_number VARCHAR(50),
    fisherfolk_reg_status VARCHAR(50),
    validation_status ENUM('Verified', 'For Validation', 'Unverified', 'Inactive', 'Deceased', 'Transferred', 'Duplicate', 'Temporarily Inactive') DEFAULT 'For Validation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES geographic_locations(location_id)
);

-- 4. Fishing Activity & Gears
CREATE TABLE IF NOT EXISTS fishing_gears (
    gear_id INT AUTO_INCREMENT PRIMARY KEY,
    fisherfolk_id VARCHAR(50),
    gear_type VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    ownership VARCHAR(50),
    estimated_value DECIMAL(10, 2),
    FOREIGN KEY (fisherfolk_id) REFERENCES fisherfolk(fisherfolk_id) ON DELETE CASCADE
);

-- 5. Fishing Boats
CREATE TABLE IF NOT EXISTS fishing_boats (
    boat_id INT AUTO_INCREMENT PRIMARY KEY,
    fisherfolk_id VARCHAR(50),
    boat_registration_no VARCHAR(100) UNIQUE,
    boat_name VARCHAR(100),
    boat_type VARCHAR(50),
    boat_material VARCHAR(50),
    boat_length_ft DECIMAL(5, 2),
    is_motorized BOOLEAN NOT NULL,
    boat_status ENUM('Active', 'Inactive', 'Under Repair', 'Lost', 'Damaged', 'Sold', 'Decommissioned') DEFAULT 'Active',
    estimated_value DECIMAL(12, 2),
    FOREIGN KEY (fisherfolk_id) REFERENCES fisherfolk(fisherfolk_id) ON DELETE CASCADE
);

-- 6. Aquaculture Profile
CREATE TABLE IF NOT EXISTS aquaculture_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    fisherfolk_id VARCHAR(50),
    culture_type VARCHAR(100),
    culture_facility VARCHAR(100),
    water_type ENUM('Freshwater', 'Brackishwater', 'Marine'),
    annual_production_kg DECIMAL(10, 2),
    estimated_annual_income DECIMAL(12, 2),
    FOREIGN KEY (fisherfolk_id) REFERENCES fisherfolk(fisherfolk_id) ON DELETE CASCADE
);

-- 7. Socioeconomic Profile
CREATE TABLE IF NOT EXISTS socioeconomic_profiles (
    fisherfolk_id VARCHAR(50) PRIMARY KEY,
    dependents_count INT DEFAULT 0,
    monthly_household_income DECIMAL(10, 2),
    fisheries_income DECIMAL(10, 2),
    housing_type VARCHAR(50),
    educational_attainment VARCHAR(50),
    FOREIGN KEY (fisherfolk_id) REFERENCES fisherfolk(fisherfolk_id) ON DELETE CASCADE
);

-- 8. Status Assessments & Vulnerability
CREATE TABLE IF NOT EXISTS status_assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    fisherfolk_id VARCHAR(50),
    engagement_status VARCHAR(50),
    is_senior_citizen BOOLEAN DEFAULT FALSE,
    is_pwd BOOLEAN DEFAULT FALSE,
    reason_for_status TEXT,
    date_of_assessment DATE,
    FOREIGN KEY (fisherfolk_id) REFERENCES fisherfolk(fisherfolk_id) ON DELETE CASCADE
);

-- 9. Disaster Impact
CREATE TABLE IF NOT EXISTS disaster_impacts (
    impact_id INT AUTO_INCREMENT PRIMARY KEY,
    fisherfolk_id VARCHAR(50),
    disaster_event_name VARCHAR(100),
    hazard_type VARCHAR(50),
    estimated_financial_loss DECIMAL(12, 2),
    recovery_status VARCHAR(50),
    FOREIGN KEY (fisherfolk_id) REFERENCES fisherfolk(fisherfolk_id) ON DELETE CASCADE
);

-- 10. Government Assistance Records
CREATE TABLE IF NOT EXISTS assistance_records (
    assistance_id INT AUTO_INCREMENT PRIMARY KEY,
    fisherfolk_id VARCHAR(50),
    program_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date_received DATE NOT NULL,
    implementing_office VARCHAR(150) DEFAULT 'BFAR Region XIII',
    funding_source VARCHAR(100),
    quantity DECIMAL(10, 2),
    unit VARCHAR(30),
    estimated_value DECIMAL(12, 2) NOT NULL,
    reference_document VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Distributed',
    remarks TEXT,
    FOREIGN KEY (fisherfolk_id) REFERENCES fisherfolk(fisherfolk_id) ON DELETE CASCADE
);