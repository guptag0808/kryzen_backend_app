const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	age:{
		type:Number,
		required:true
	},
	address:{
		type:String,
		required:true 
	},
	photo:{
		type:String,
		required:true
	}
},{versionKey: false}) 
 


const DataModel =mongoose.model('Data',userSchema)

module.exports={
	DataModel
}