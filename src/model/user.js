const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')
const {Tasks} = require('./tasks')

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        dropDups: true, 
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('The Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0) {
                throw new Error('The age entered is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Sorry, the password is invalid as the password includes the term "password"')
            }
        }
    },
    tokens:[{
        token: {
            type:String, 
            required:true
        }
    }],
    avatars: {
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.plugin(uniqueValidator)

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async ( email, password ) => {
    const user = await User.findOne( { email } )
    if(!user) {
        throw new Error('The credentials are invalid!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('The credentials are invalid!')
    }
    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next)  {
    const user = this
    await Tasks.deleteMany( { owner: user._id } )
    next()
})
 
const User = mongoose.model('user',userSchema)

module.exports = {
    User
}