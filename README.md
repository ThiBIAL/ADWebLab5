## Setup Instructions

1. Clone the repository: https://github.com/ThiBIAL/ADWebLab5.git

2. Install dependencies: npm install express mysql dotenv

3. Create a .env file in the root directory with the following content:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=homework_db

4. Import the database schema and data: mysql -u root -p < homework_db.sql

5. Start the application: node homework_db.js

Your application should now be running at http://localhost:3000
