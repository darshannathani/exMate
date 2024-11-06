# Exmate: Online Examination System

**Exmate** is a secure platform for online examinations. It connects examiners and candidates and ensures transparent assessments. It provides features for exam scheduling, candidate management, and question handling across multiple exam types.

## Technology Stack

### Frontend
- **Framework:** React.js (using Vite for faster build times and development)
- **Libraries:** Axios (for HTTP requests), React Router (for routing)

### Backend
- **Java:** Spring Boot
- **Spring Data JPA**

### Database
- **SQL Lite**

## Getting Started

### Prerequisites
Ensure the following are installed on your system:
- **Node.js** and **npm** or **yarn** (for the frontend)
- **Java** (for Spring Boot)
- **SQL Server** (for SQL Express database)

### Project Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/darshannathani/exMate.git
cd exmate
```

#### Step 2: Install Dependencies
#### *Frontend*
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

#### *Backend*
Navigate to the backend directory and install dependencies to build the project:
```
cd backend
./mvnw clean install
```

#### Step 3: Database Setup
Ensure SQL Express is running.
Configure your *application.properties* in the backend directory to match your SQL Server credentials.
```bash
spring.jpa.properties.hibernate.format_sql=true

spring.datasource.url= jdbc:sqlserver://localhost:1433;encrypt=true;trustServerCertificate=true;databaseName=PreInternship
spring.datasource.username= <username>
spring.datasource.password= <password>

spring.jpa.properties.hibernate.dialect= org.hibernate.dialect.SQLServerDialect
spring.jpa.hibernate.ddl-auto= update
```

#### Running the Application
#### *Frontend*
In the frontend directory, start the Vite development server:
```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the frontend.

#### *Backend*
In the backend directory, start the Spring Boot server:
```bash
./mvnw spring-boot:run
```
The backend server will run on http://localhost:8080.

## Commit Type Convention
Follow these conventions for clear and consistent commit messages:

- feat: For new features
- fix: For bug fixes
- docs: For documentation updates
- style: For code styling changes
- refactor: For refactoring without affecting functionality
- test: For test case additions or updates
- chore: For other maintenance tasks
