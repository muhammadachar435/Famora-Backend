# Famora E-Commerce Website [Backend]

A Node.js and Express.js backend for the Famora e-commerce platform, providing secure APIs for products, cart, orders, and user management, integrated with MongoDB.

## Features

RESTful APIs for products, cart, orders, and users.

Secure authentication with password hashing and role-based admin access.

CRUD operations for product and order management.

Session management: 7-day login sessions for users.

Tested with Postman for reliability.

Deployed on Railway, ready for production use.

## Tech Stack

Backend: Node.js, Express.js

Database: MongoDB

Tools: Postman (API testing), Git/GitHub

Deployment: Railway

## Project Structure

backend/
│
├─ controllers/       
├─ models/            
├─ routes/            
├─ middlewares/       
├─ config/         
├─ utils/             
├─ .env               
├─ main.js          
├─ package.json       
└─ README.md          

## Getting Started

## Clone the repository:
git clone https://github.com/muhammadachar435/Famora-Backend.git

## Navigate to the project folder:
cd famora-backend

## Install dependencies:
npm install

Add environment variables in .env (MongoDB URI, JWT secret, etc.).

## Run the server:
node main.js / npm run dev 


Test API endpoints in Postman using http://localhost:5000 (or your configured port).
