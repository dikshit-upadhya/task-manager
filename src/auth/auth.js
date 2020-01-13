const jwt = require('jsonwebtoken')
const {User} = require('../model/user')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log(`.${token}.`)
        const decoded = jwt.verify(token, 'thisismynewcourse')
        // console.log(decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token})
        // console.log(user)
        if(!user) {
            throw new Error()
        }

        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({error: 'Please authenticate', errormessage: error})
    }
}

module.exports = {
    auth
}