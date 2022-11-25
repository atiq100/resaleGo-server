const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6znnq0v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const usersCollection = client.db('resaleGo').collection('users');
        const bikeCategoriesCollection = client.db('resaleGo').collection('bike-categories');

        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })

        // bike categories
        app.get('/bike-categories',async(req,res)=>{
            const query = {}
            const bikeCategories = await bikeCategoriesCollection.find(query).toArray()
            res.send(bikeCategories);

        })
    }
    finally{

    }
}
run().catch(console.log)

app.get('/',async(req,res)=>{
    res.send('server is running');
})

app.listen(port, ()=> console.log(`running on ${port}`))