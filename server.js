const express = require('express');
const  mongodb = require('mongodb');
const objectId  = require('mongodb').ObjectId;
const bodyparser = require('body-parser');
const app = express();
const port = 5002;
const cors = require('cors');

app.use(bodyparser.json()); 
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

async function loadData(){

  const client = await mongodb.MongoClient.connect('mongodb://sa:abcd123@ds135724.mlab.com:35724/papernote_main',{
    useNewUrlParser: true
  });
  
  
  return client.db('papernote_main').collection('entries');
}

app.get('/api/db', async(req, res) => {
  const entries = await loadData();
  res.send(await entries.find({}).toArray()); 
})

app.post('/api/db/post', async(req, res) =>{
  console.log(req.body.id)
  const entries = await loadData();
  await entries.insertOne({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    muscles: req.body.muscles,
    Dollar: req.body.Dollar
  });
  res.status(201).send();
})
app.post('/api/db/put', async(req, res) =>{
  console.log(req.body._id)
  const entries = await loadData();
  await entries.updateOne({_id: objectId(req.body._id)},{$set :{
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    muscles: req.body.muscles,
    Dollar: req.body.Dollar
  }},);
  res.status(200).send();
})

app.delete('/api/db/del/:id', async(req, res) => {
  console.log('deleting.....')
  const entries = await loadData();
  await entries.deleteOne({_id:new mongodb.ObjectID( req.params.id)})
  res.status(200).send();
})

app.get('/api/store', (req, res) =>{

    const store = [{
        id: 'overhead-press',
        title: 'Axis Laser 3D Printer',
        description: 'Axis 3D laser printer: a new desktop tool that uses laser cutter/engraver technology to shape wood, leather, fabric & more at an amazing price.',
        muscles: 'Technology',
        Dollar: 23
      },
      {
        id: 'dips',
        title: 'Portable Finger Lock',
        description: 'PORTABLE FINGER LOCK : It is a mini portable smart box lock, and its pocket size can be carried to everywhere you want. Powerful smart universal fingerprint lock.',
        muscles: 'Technology',
        Dollar: 7
      },
      {
        id: 'barbell-curls',
        title: 'QRobot Sweeper',
        description: 'The cube gives a signal which QRobot uses to position itself in the room. It will know where exactly in the room it is and which part of the floor it has mopped or swept',
        muscles: 'Technology',
        Dollar: '0'
      },
      {
        id: 'f1',
        title: 'Sustainable Premium Sneakers',
        description: 'Handmade unisex sneakers designed to inspire change towards a more conscious lifestyle & equitable future.',
        muscles: 'Fashion',
        Dollar: '0'
      },
    {
        id: 'f2',
        title: 'Designer Swim Shorts For Men',
        description: 'Luxury Designer Swim Shorts For Men. Tailored for a superior fit. Made with water resistant, quick drying fabric. Go from Pool to Party.',
        muscles: 'Fashion',
        Dollar: '0'
      },
    {
        id: 'f3',
        title: 'Cue Hardcover Backpack',
        description: 'The Cue Hardcover Backpack is a polycarbonate bag for daily + long-distance travel and Made of durable polyester; Ideal for hiking and camping.',
        muscles: 'Fashion',
        Dollar: '0'
      },
    {
        id: 'd1',
        title: 'Robotic Camera Assistant',
        description: 'Replace your fluid head with a 4-axis motorized head. Hold up to 15lbs and capture amazing video and time-lapse on a tripod or slider.',
        muscles: 'Design',
        Dollar: '0'
      },
    {
        id: 'd2',
        title: 'SmartCup',
        description: 'Experience pleasure in every sip of the perfectly prepared beverage with SmartCup automated brewing technology.',
        muscles: 'Design',
        Dollar: '0'
      },
    {
        id: 'd3',
        title: 'Delta Printer : Photograghy',
        description: 'Capture and print, handy and mobile.Updated for the digital age yet retaining the simplicity and fun.',
        muscles: 'Design',
        Dollar: '0'
      },
    {
        id: 'ff1',
        title: 'Cricket Protein Powder',
        description: 'The superfood of the future for folks whose current protein powder is bad for the environment and for themselves.',
        muscles: 'Food',
        Dollar: '0'
      },
    {
        id: 'ff2',
        title: 'Sea Lunch Box',
        description: 'An eco-friendly, portion separated lunch box witha stainless steel, easy-clean, flip top design.',
        muscles: 'Food',
        Dollar: '0'
      },
    {
        id: 'ff3',
        title: 'Vegan Chocolate',
        description: 'Heavenly Chocolate that tastes divine & is free from dairy, gluten, soy and palm oil & only 4% sugar.',
        muscles: 'Food',
        Dollar: '0'
      },
    ]
    res.send(store);
})
app.listen(port, () => console.log(`server started at ${port}`) )