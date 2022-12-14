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
        const allBikeCategoriesCollection = client.db('resaleGo').collection('allBike');
        const bookingCollection = client.db('resaleGo').collection('bookings');

        app.get('/users',async(req,res)=>{
            const query ={}
            const users = await usersCollection.find(query).toArray()
            res.send(users);
        })

        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })

        app.get('/bookings',async(req,res)=>{
            const email = req.query.email
            const query = {email: email};
            const book = await bookingCollection.find(query).toArray()
            res.send(book);
        })

        app.post('/bookings',async(req,res)=>{
            const book = req.body;
            const result = await bookingCollection.insertOne(book)
            res.send(result);
        })

        app.delete('/bookings/:id', async(req,res)=>{
            const id = req.params.id;
            const query={_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query);
            res.send(result)
        })

        app.delete('/users/:id', async(req,res)=>{
            const id = req.params.id;
            const query={_id: ObjectId(id)}
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/users/admin/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isAdmin: user?.userType === 'admin'})
        })

        app.get('/users/seller/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isSeller: user?.userType === 'Seller'})
        })

        app.get('/users/buyer',async(req,res)=>{
            const userType = req.query.userType;
            const query = {userType:userType};
            const user = await usersCollection.find(query).toArray()
            res.send(user)
        })

        app.get('/users/buyer/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {email}
            const user = await usersCollection.findOne(query);
            res.send({isBuyer: user?.userType === 'Buyer'})
        })


        app.put('/users/admin/:id', async(req,res)=>{
            

            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true};
            const updatedDoc={
                $set:{
                    userType:'admin',
                    
                }
            }
            const result = await usersCollection.updateOne(filter,updatedDoc,options)
            res.send(result)
        })

        app.put('/users/verify/:id', async(req,res)=>{
            

            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true};
            const updatedDoc={
                $set:{
                    
                    isVarified:'varified'
                }
            }
            const result = await usersCollection.updateOne(filter,updatedDoc,options)
            res.send(result)
        })
        
        app.put('/all-bikes/advertise/:id', async(req,res)=>{
            

            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true};
            const updatedDoc={
                $set:{
                    
                    advertise:'advertisement'
                }
            }
            const result = await allBikeCategoriesCollection.updateOne(filter,updatedDoc,options)
            res.send(result)
        })

        

        // bike categories
        app.get('/bike-categories',async(req,res)=>{
            const query = {}
           
            const bikeCategories = await bikeCategoriesCollection.find(query).toArray()
            res.send(bikeCategories);

        })

        app.get('/bike-categories/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const bikeCategories = await bikeCategoriesCollection.findOne(query)
            res.send(bikeCategories)
        })

       

        

        //bike resale details
        app.get('/all-bikes',async(req,res)=>{
           
            const query={}
            // if(req.query.category){
            //     query = {
            //         category: req.query.category
            //     }
            // }
            // if(req.query.category_id){
            //     query = {
            //         category_id: req.query.category_id
            //     }
            // }
            const allBike = await allBikeCategoriesCollection.find(query).toArray()
            res.send(allBike)
        })
        app.get('/all-bikes/manage',async(req,res)=>{
            const email = req.query.email
            const query = {email: email};
            const allBike = await allBikeCategoriesCollection.find(query).toArray()
            res.send(allBike);
        })

        app.get('/all-bikes/advertise/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const allBike = await allBikeCategoriesCollection.findOne(query)
            res.send({isAdvertise: allBike?.advertise === 'advertisement'})
        })

       app.get('/all-bikes/:category_id',async(req,res)=>{
        const category_id = req.params.category_id
        
        const query = {category_id: category_id}
        const allBike = await allBikeCategoriesCollection.find(query).toArray()
        //console.log(allBike);
            res.send(allBike)
       })

      

        app.post('/all-bikes',async(req,res)=>{
            const query = req.body
            const allBike = await allBikeCategoriesCollection.insertOne(query)
            res.send(allBike)
        })
        app.delete('/all-bikes/:id', async(req,res)=>{
            const id = req.params.id;
            const query={_id: ObjectId(id)}
            const result = await allBikeCategoriesCollection.deleteOne(query);
            res.send(result)
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