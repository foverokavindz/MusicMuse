const express = require('express');
const app = express();
const cors = require('cors');
// Enable CORS for all routes
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = require('./connection');

const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const client_id = process.env.SPOTIFY_API_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const auth_token = Buffer.from(
  `${client_id}:${client_secret}`,
  'utf-8'
).toString('base64');

/*
const getAuth = async () => {
  try {
    //make post request to SPOTIFY API for access token, sending relavent info
    const token_url = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({ grant_type: 'client_credentials' });

    const response = await axios.post(token_url, data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    //return access token
    spotifyAccessToken = response.data.access_token;
    return response.data.access_token;
    //console.log(response.data.access_token);
  } catch (error) {
    //on fail, log the error in console
    console.log(error);
  }
};

getAuth();

*/

require('./start/routes')(app);

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Server started on port ${port}`));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db('user').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!'
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// run().catch(console.dir);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server started on port ${port}`));

// app.get('/', (req, res) => {
//   res.status(200).send('HI HI HI');
// });

// async function run1() {
//   try {
//     // Connect to the "insertDB" database and access its "haiku" collection
//     const database = client.db('music-muse');
//     const haiku = database.collection('user');

//     // Create a document to insert
//     const doc = {
//       title: '2 Record of a Shriveled Datum',
//       content: 'No bytes, no problem. Just insert a document, in MongoDB',
//     };
//     // Insert the defined document into the "haiku" collection
//     const result = await haiku.insertOne(doc);

//     // Print the ID of the inserted document
//     console.log(`A document was inserted with the _id: ${result.insertedId}`);
//   } finally {
//     // Close the MongoDB client connection
//     await client.close();
//   }
// }
// // Run the function and handle any errors
// run1().catch(console.dir);
/*
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    return client.db(); // Return the connected database
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log('Disconnected from MongoDB!');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

module.exports = { connectToDatabase, closeDatabaseConnection };
*/
