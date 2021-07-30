const express = require('express')
const app = express()
const MongoClient  = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri =    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujcbv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const eventCollection = client.db("shoppingValley").collection("products");
  
  app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.get('/event/:id', (req, res) => {
    eventCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, items) => {
      res.send(items[0])
    })
  })

  app.post('/addEvent', (req, res) =>{
    const newEvent = req.body;
    console.log('adding new event:', newEvent)
    eventCollection.insertOne(newEvent)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    eventCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      console.log(result)
    })
  })

//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})