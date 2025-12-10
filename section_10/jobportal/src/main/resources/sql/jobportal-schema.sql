-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
     id BIGINT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL UNIQUE,
    logo VARCHAR(500),
    industry VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    locations VARCHAR(1000),
    founded INT NOT NULL,
    description TINYTEXT,
    employees INT,
    website VARCHAR(500),
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by  VARCHAR(20)  NOT NULL,
    updated_at  TIMESTAMP   DEFAULT NULL,
    updated_by  VARCHAR(20) DEFAULT NULL
    );

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'NEW' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        created_by VARCHAR(20) NOT NULL,
        updated_at TIMESTAMP DEFAULT NULL,
        updated_by VARCHAR(20) DEFAULT NULL
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            company_id BIGINT NOT NULL,
            location VARCHAR(255) NOT NULL,
            work_type VARCHAR(50) NOT NULL, -- On-site, Remote, Hybrid
            job_type VARCHAR(50) NOT NULL, -- Full-time, Part-time, Contract, Freelance
            category VARCHAR(100) NOT NULL, -- Technology, Design, Marketing, Sales, Finance, Healthcare, Education, Operations
            experience_level VARCHAR(50) NOT NULL, -- Entry Level, Mid Level, Senior Level, Executive Level
            salary_min DECIMAL(12,2) NOT NULL,
            salary_max DECIMAL(12,2) NOT NULL,
            salary_currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
            salary_period VARCHAR(20) DEFAULT 'year' NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT, -- JSON array stored as text
            benefits TEXT, -- JSON array stored as text
            posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            application_deadline TIMESTAMP,
            applications_count INT DEFAULT 0,
            featured BOOLEAN DEFAULT FALSE,
            urgent BOOLEAN DEFAULT FALSE,
            remote BOOLEAN DEFAULT FALSE,
            status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL, -- ACTIVE, CLOSED, DRAFT
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            created_by VARCHAR(20) NOT NULL,
            updated_at TIMESTAMP DEFAULT NULL,
            updated_by VARCHAR(20) DEFAULT NULL,
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);