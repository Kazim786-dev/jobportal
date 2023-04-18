const express = require('express')
require('dotenv').config()
const cors = require('cors');

const mongoose = require('mongoose')
const userroute = require('./routes/userroute')
const studentroute = require('./routes/studentroute')
const employerroute = require('./routes/employerroute')

var port = process.env.PORT;

const app = express()
app.use(express.json())
app.use(cors())


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB connected")
}).catch((err) => {
    console.log(err)
})


app.use('/user', userroute)

app.use('/std', studentroute)

app.use('/emp', employerroute)

app.listen(port || 8000, () => {
    console.log(`App listening on port ${port}`)
})