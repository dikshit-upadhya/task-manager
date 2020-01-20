// Users\PAVILION\mongodb\bin\mongod.exe --dbpath=Users\PAVILION\mongodb-data
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOOSE_URL,{
    useNewUrlParser: true,
    useCreateIndex: true
})

