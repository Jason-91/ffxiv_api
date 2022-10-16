# FFXIV Market Board API

## Overview
REST architecture API to be used in conjunction with FFXIV Market Board Web App (ffxiv_marketboard) to connect with crowdsourced databases.
Used to demonstrate understanding of API REST protocols. Other practiced techniques include basic object destructuring on resulting objects from API calls.

## Technologies Used
* JavaScript (ES6)
* Node.js
* Express
* Axios
* CORS

## Description
**API that uses REST protocols to communicate with various crowdsourced databases**
* Designed server with Node.js and Express framework using REST architecture
* Retrieved aggregate data from multiple APIs using asynchronous HTTP requests via Axios
* Bypassed CORS restrictions by whitelisting corresponding web addresses

## Getting Started

### `npm i`
Install/update all dependencies/packages

### `npm start`
Starts the backend on port 8000. Required for functionality of frontend web app (ffxiv_marketboard).