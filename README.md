# Secure Wallet Management System

## Overview

This project is a **Digital Wallet System with Cash Management and Fraud Detection** developed using **Express.js** and **MongoDB**. It allows users to perform **credit**, **debit**, and **fund transfers** securely, featuring a **fraud detection mechanism** that flags suspicious transactions automatically.

The system supports role-based authentication and authorization for both **users** and **administrators**, employing **JWT tokens** for secure access and **bcrypt** for password hashing. Input validation is implemented using **Express Validator** to ensure data integrity.

---

## Features

### User Features
- **User Registration & Login** with hashed passwords using bcrypt  
- Secure **JWT-based authentication** for protected routes  
- Ability to **credit**, **debit**, and **transfer funds** between wallets  
- View **transaction history**  
- Each transaction supports a `currency` field.
  - If not specified, the currency defaults to **INR**.
  - Supported currencies: **INR**, **USD**, **EUR**.
- Transactions are validated for correctness and security

### Fraud Detection
- Suspicious transactions are automatically **flagged** based on custom logic  
- Upon detection, a **mock email notification** is sent to the admin for immediate action

### Admin Features
- View **all registered users**  
- Aggregate **total wallet balances** across all users  
- Retrieve **top users** by wallet balance with customizable count indicating the number of top users the admin wants to retrieve.  
- Access and review **flagged suspicious transactions**

---

## Technologies Used
- **Node.js** and **Express.js** for backend API  
- **MongoDB** for database (two collections: Users and Wallets)  
- **bcrypt** for password hashing  
- **JWT (JSON Web Tokens)** for authentication  
- **Express Validator** for validating incoming request data  

---

## Database Structure

- **Users Collection:** Stores user credentials and roles.
- **Wallet Collection:** Tracks wallet balances, transactions, and flagged transactions.

---

## Setup & Installation
1. Clone the repository:
   git clone https://github.com/mishka832/Digital-Wallet.git
2. Navigate to the project directory:
   cd Digital-Wallet
3. Install dependencies:
   npm install
4. Set up environment variables in .env file:
   - DATABASE_URL: MongoDB connection string
   - JWT_SECRET: Secret key for JWT authentication
5. Start the server:
   npm start
## API Testing with Postman

- A Postman collection is provided in the `postman` folder for easy API testing.  
- Import the collection into Postman to test all available endpoints.  
- The Postman folder also contains a README with details on how to use the collection.

