// Read .env file and set environment variables
require('dotenv').config();
// Use official mongodb driver to connect to the server
const { MongoClient, ObjectId } = require('mongodb');

// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);

module.exports = client