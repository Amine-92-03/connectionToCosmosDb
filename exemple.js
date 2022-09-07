// Read .env file and set environment variables
require('dotenv').config();
const random = Math.floor(Math.random() * 100);
// Use official mongodb driver to connect to the server
const { MongoClient, ObjectId } = require('mongodb');

// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);



async function main(){
       // Use connect method to connect to the server
       await client.connect();
       // Database reference with creation if it does not already exist
        const db = client.db(`adventureworks`);
        console.log(`New database:\t${db.databaseName}\n`);
        // Collection reference with creation if it does not already exist
        const collection = db.collection('products');
        console.log(`New collection:\t${collection.collectionName}\n`);
        // const db = await client.db(`adventureworks`).collection('products').updateOne(query, update, options)
        
        // create index to sort by name
        const indexResult = await collection.createIndex({ name: 1 });
        console.log(`indexResult: ${JSON.stringify(indexResult)}\n`);

        // Create new doc and upsert (create or replace) to collection
        const product = {
            category: "gear-surf-surfboards",
            name: `Yamba Surfboard-${random}`,
            quantity: 12,
            sale: false
        };
        const query = { name: product.name};
        const update = { $set: product };
        const options = {upsert: true, new: true};
        // Insert via upsert (create or replace) doc to collection directly
        const upsertResult1 = await collection.updateOne(query, update, options);
        console.log(`upsertResult1: ${JSON.stringify(upsertResult1)}\n`);

        // Update via upsert on chained instance
        const query2 = { _id: ObjectId(upsertResult1.upsertedId) };
        const update2 = { $set: { quantity: 29 } };
        const upsertResult2 = await client.db(`adventureworks`).collection('products').updateOne(query2, update2, options);
        console.log(`upsertResult2: ${JSON.stringify(upsertResult2)}\n`);

        // Point read doc from collection:
        // - without sharding, should use {_id}
        // - with sharding,    should use {_id, partitionKey }, ex: {_id, category}
        const foundProduct = await collection.findOne({
            _id: ObjectId(upsertResult1.upsertedId), 
            category: "gear-surf-surfboards"
        });
        console.log(`foundProduct: ${JSON.stringify(foundProduct)}\n`);
    }
    main()
      .then()
      .catch(console.error)
      .finally(() => client.close());

   