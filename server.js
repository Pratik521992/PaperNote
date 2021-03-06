const express = require('express');
const jwt = require('jsonwebtoken');
const mongodb = require('mongodb');
const objectId  = require('mongodb').ObjectId;
const bodyparser = require('body-parser');
const passport  = require('passport');
const app = express();
const port = 5000;
const cors = require('cors');


app.use(bodyparser.json()); 
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

//require('./passport')(passport);

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});


async function loadData(){

	const client = await mongodb.MongoClient.connect('mongodb://sa:abcd123@ds135724.mlab.com:35724/papernote_main',{
		useNewUrlParser: true
	});
  
  
	return client.db('papernote_main').collection('entries');
}

app.get('/api/db' , async(req, res) => {

	const entries = await loadData();
	res.send(await entries.find({}).toArray()); 
});

//get users from UI///////
app.post('/api/login', (req, res)=>{
    
	//real data
	const realUser = req.body;
	console.log(realUser)
	//mock user
	const user ={
		user: 'Pratik',
		pass: 'Nini'
	};
	if((realUser.user===user.user)&&(realUser.pass===user.pass)){
		jwt.sign({realUser}, 'shhhh' ,(err, token) => {
			res.json({
				token,
				realUser
			});
			
		});
	}
	else{
		res.json({error:'not authenticated'});
	}
});

app.post('/api/post', verfiyToken, (req, res)=>{
	
	jwt.verify(req.token, 'shhhh', (err, authData)=>{
		if(err){ res.sendStatus(403);
		}
		else{
			res.send({
				authData
			}); 
		}
	});
});

app.post('/api/db/post' ,async(req, res) =>{
	
	const entries = await loadData();
	await entries.insertOne({
		id: req.body.id,
		title: req.body.title,
		description: req.body.description,
		muscles: req.body.muscles,
		Dollar: req.body.Dollar
	});
	res.status(201).send();
});
app.post('/api/db/put', async(req, res) =>{

	const entries = await loadData();
	await entries.updateOne({_id: objectId(req.body._id)},{$set :{
		id: req.body.id,
		title: req.body.title,
		description: req.body.description,
		muscles: req.body.muscles,
		Dollar: req.body.Dollar
	}},);
	res.status(200).send();
});

app.delete('/api/db/del/:id', async(req, res) => {
	
	const entries = await loadData();
	await entries.deleteOne({_id:new mongodb.ObjectID( req.params.id)});
	res.status(200).send();
});

function verfiyToken(req, res, next){
	
	const bearerHeader = req.headers['authorization'];
	
	if(typeof bearerHeader !== 'undefined'){
		const bearer  = bearerHeader.split(' ');
		const bearertoken = bearer[1];
		req.token = bearertoken;
    
		next();
	}
	else {
		res.sendStatus(403);
	}

}

app.listen(port, () => console.log(`server started at ${port}`) );
