# Event Management API


## Description

Event Management API is an API will carry operations mainly of creating events, allowing different users to book events available in the system. The API uses Json Web Token (JWT) to authorise  users to access or carry out operations based on their role in the system.


## Technologies Used

The following are the technologies which have been used in this API with their URLs

- Postgres
- Docker: https://www.docker.com/
- NodeJs: https://nodejs.org/en


## Service local development
The service demonstrates different operation of Event, Booking and Users (CRUD operation) using ExpressJs.

* To set up the service

Create a `.env` file with at least the following variables as per `.env.example`:
* DATABASE_URL
* TEST_DATABASE_URL
* PROD_DATABASE_URL

Install required packages
```bash
npm install
```

Start the service:
```bash
npm run dev
```

This script starts the application in the development mode, consult `package.json` to learn more about scripts


* Now you can open your browser and interact with these URLs:

API JSON based web API based on OpenAPI: http://localhost:9010/api-docs/
Note that the 9010 is the default port, replace it with the port you chose if you have passed a different one in your `.env` file

## Event Management Platform
[Here](https://github.com/UmuhireJessie/event-management-fn) is the link to the frontend of the Event Management Platform.

## Author and Acknowledgement
Jessie Umuhire Umutesi
