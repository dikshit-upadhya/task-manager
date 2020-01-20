const express = require('express')
const mongoose = require('mongoose')
require('./db/mongoose.js')
const {router:userRouter} = require('./routers/user')
const {router:taskRouter} = require('./routers/task')
const bcrypt = require('bcryptjs')

const app = express()
const port = process.env.PORT 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('',(req, res) => {
    res.send('Hello there, this is just a temporary layout of the task-manager app')
})


app.listen(port , () => {
    console.log('The server is up on port ' + port)
    console.log(process.env.PORT)
    console.log(process.env.JSON_SECRET_MESSAGE)
})
