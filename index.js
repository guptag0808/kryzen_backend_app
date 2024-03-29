const express= require('express')
const {connection} =require('./db.js')
const app= express()
const PORT = 8000
const cors = require('cors')
const {userRouter} =  require('./routes/userRouter.js')

const {dataRouter} = require('./routes/formData.js')

app.use(cors())
app.use(express.json())
app.use('/',userRouter)

app.use('/',dataRouter)

 
app.listen(PORT,async()=>{
	try{
		await connection 
		console.log('connected to db')
	}catch(err){
		console.log(err.message)
	}
  console.log('Server is running at port',PORT)
})























































