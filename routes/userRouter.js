const express= require('express')
const {UserModel} = require('../models/userModel')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Signup route
userRouter.post('/signup', async (req, res) => {
	const { username, password } = req.body;
        
	
	try {
		if(!username || !password  ){
			return res.status(422).send({error:"Please add all the fields"})
		}
	  // Check if the user with the given email already exists
	  const existingUser = await UserModel.findOne({ username });
  
	  if (existingUser) { 
		return res.status(409).json({ error: 'User with this name already exists' });
	  }
  
	  const hashedPassword = await bcrypt.hash(password, 10);
  
	  const user = new UserModel({
		username,
		password: hashedPassword,
	  });
  
	  await user.save();
  
	  res.status(201).json({ "msg": 'User signup successfully' });
	} catch (error) {
		console.log(error.message)
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  })

  //Login Routes
  userRouter.post('/login', async (req, res) => {
	const { username, password } = req.body;
  
	try {
	  const user = await UserModel.findOne({ username });
            
	  if (!user) {
		return res.status(401).json({ error: 'Invalid username or password' });
	  }	  const passwordMatch = await bcrypt.compare(password, user.password);

  
  
	  if (!passwordMatch) {
		return res.status(401).json({ error: 'Invalid username or password' });  
	  }
  
	  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
		expiresIn: '1h', // Token expires in 1 hour
	  });
       const {_id,name}= user
	
	  res.status(200).send({ "msg":"Login Successfull","Token":token, user:{_id,name}});
	} catch (error) {
		console.log(error.message)
	  res.status(500).json({ error: error.message});
	}
  });

  userRouter.post('./logout',async(req,res)=>{
	try{
		res.clearCookie('token');
		res.status(200).send({ "msg": 'Logout successful' });

	}catch(err){
		console.log(err.message)
	}
  })

 

  module.exports={
	userRouter
  }