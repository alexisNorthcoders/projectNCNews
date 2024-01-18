# Northcoders News API

Welcome to the repository for NC News, a social media article sharing platform reminiscent of popular news aggregation and discussion sites. NC News allows users to explore a wide variety of articles, contribute with comments, and engage with a community through voting on content.

## Live Version

You can explore the live version of the application here: [NC News Live](https://nc-news-2sb7.onrender.com).

## Project Summary

NC News is a backend application designed to simulate a real-world social media platform for sharing and discussing articles (like reddit). 
It is built in JavaScript using node-postgres, Express and PostgreSQL to provide the API endpoints to allow to access a database.

The API is hosted on Render and the database is on ElephantSQL.

This project was built using TDD methodology and MVC (Model-View-Controller) in mind.

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js (minimum version: 21)
- PostgreSQL (minimum version: 8.7)

### Installation

1. **Clone the repository:**

git clone https://github.com/alexisNorthcoders/projectNCNews.git

2. **Navigate to the repository directory:**

cd nc-news

3. **Install dependencies:**

npm install

4. **Set up the local databases:**

npm run setup-dbs

5. **Seed the development database:**

npm run seed

6. **To run the tests:**

npm run test

### Environment Setup

You'll need two `.env` files to manage the environment variables for development and testing.

1. **Create a `.env.development` file in the root directory:**

PGDATABASE=nc_news

2. **Create a `.env.test` file in the root directory:**

PGDATABASE=nc_news_test

Make sure to add these files to your `.gitignore`.




