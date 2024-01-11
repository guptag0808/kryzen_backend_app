const express= require('express')
// const multer = require('multer');
const PDFDocument = require('pdfkit');
const axios = require('axios')
const path = require('path')
// const {DataModel} = require('../models/formDataModel')
const {authentication} = require('../middleware/authentication')
// const {imageUpload} = require('../middleware/upload')
const {DataModel} = require('../models/formDataModel')
const dataRouter= express.Router()
const generatePDF = require('../utils/generatePDF')

 //Routes for storing  user data 
dataRouter.post("/data",authentication,async(req,res)=>{
	const {name,age,address,photo} = req.body
	
	console.log(req.body)  
	try {
		const newData = new DataModel({name,age,address,photo})
	
		await newData.save(); 
		res.status(200).json({ "msg": 'Data uploaded successfully.',newData });
	  } catch (error) {
		res.status(500).json({ error: error.message });
	  }
})

//Get the Data By Id

dataRouter.get('/data/:id ',async(req,res)=>{
	try {
		const users = await DataModel.find();
		res.status(200).json(users);
	  } catch (error) {
		console.error('Error getting form data:', error.message);
		res.status(500).json({ message: 'Internal Server Error' });
	  }
})

// Generate PDF 

dataRouter.get('/pdfGenerater', async (req, res) => {
	try {
		const topUser = await DataModel.findOne().sort({ _id: -1 });
		const userDetails = {
		  name: topUser.name,
		  age: topUser.age,
		  address: topUser.address,
		  photoURL: topUser.photo,
		};
		console.log(userDetails)
	
		const doc = new PDFDocument();
	
		// Set content disposition to force download
		res.setHeader(
		  "Content-Disposition",
		  `attachment; filename=${userDetails.name}.pdf`
		);
	
		// Pipe the PDF content to the response
		doc.pipe(res);
	
		// Header
		doc.fontSize(20).text('User Details', { align: 'center' });
	
		// Add content to the PDF
		doc.moveDown(); // Add some space
		doc.fontSize(16).text(`Name: ${userDetails.name}`);
		doc.fontSize(16).text(`Age: ${userDetails.age}`);
		doc.fontSize(16).text(`Address: ${userDetails.address}`);
	
		// Stylized Image Border
		if (userDetails.photoURL) {
		  const imageResponse = await axios.get(userDetails.photoURL, {
			responseType: 'arraybuffer',
		  });
	
		  const imageBuffer = Buffer.from(imageResponse.data);
	
		  // Calculate the position for the image
		  const imageX = 100;
		  const imageY = doc.y + 10;
	
		  // Draw a border around the image
		  doc.rect(imageX - 5, imageY - 5, 210, 210).stroke('#3498db');
		  
		  // Embed the image in the PDF
		  doc.image(imageBuffer, imageX, imageY, { width: 200, height: 200 });
		}
	
		// End the document
		doc.end();
	  } catch (err) {
		res
		  .status(500)
		  .json({ message: "Internal server error", error: err.message });
	  }
	})

module.exports={  
	dataRouter
}