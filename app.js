const client = require('./db')
const cron = require('node-cron')

async function insertData(){
    await client.connect();
    const db = client.db(`adventureworks2022`);
    const collection = db.collection('produit2022');
    const product = {
        category: "gear-surf-surfboards",
        name: `Yamba Surfboard-${i}`,
        quantity: 12,
        sale: false
    };
    const response = await collection.insertMany([product])
    console.log(response, i);
    client.close()
}

cron.schedule('*/5 * * * * *', ()=>{
    console.log('__________Hello_____________');
    insertData()
}
)

// // (() => client.close())()
// const cleanup = (event) => { // SIGINT is sent for example when you Ctrl+C a running process from the command line.
//     client.close(); // Close MongodDB Connection when Process ends
//     process.exit(); // Exit with default success-code '0'.
//   }

// process.on('SIGINT', cleanup);
// process.on('SIGTERM', cleanup);
