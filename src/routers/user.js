const express = require('express')
const {User} = require('../model/user.js')
const jwt = require('jsonwebtoken')
const {auth} = require('../auth/auth')
const router = new express.Router()

router.post('/user/login', async ( req, res) => {
    console.log(req.body)
    try {
        const user = await User.findByCredentials( req.body.email, req.body.password )
        const token = await user.generateToken()
        if(!user) {
            return res.status(401).send('The credentials provided were incorrect, or the user doesn\'t exists' )
        }
        res.status(201).send({user , token})
    } catch( error ) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/user',  async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.generateToken()
        res.status(201).send({user, token})
    } catch (e) {
        console.log(e)
        res.status(400).send('Something went wrong while the creation of the user.')
    }
})

router.patch('/user/me/update', auth, async (req,res) => {
    try{
        console.log(req.body)
        const updatedUser = await User.findByIdAndUpdate(req.user._id , req.body, {new: true, runValidators: true, useFindAndModify: false})
        if(!updatedUser) {
            return res.status(404).send('no such user records found')
        }
        res.send(updatedUser)
    }
    catch(error) {
        res.send(error).status(400)
    }
}) 

router.get('/user/me', auth, async (req,res) => {
    console.log(req.body)

    try {
        console.log(req.user)
        res.send(req.user)
    } catch (error) {
        res.status(400).send('ohoo, there was something wrong with getting the database of this id')
    }
})

router.delete('/user/me', auth, async (req, res) => {
    try {
        console.log(req.body)
        const deletedUser = await req.user.remove()
        console.log(deletedUser)
        if(!deletedUser) {
            return res.status(404).send('No such records found!')
        }
        res.send(deletedUser)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.post('/user/me/logout', auth, async (req, res) =>  {
    // console.log(req.token)
    try{
        req.user.tokens = req.user.tokens.filter( element => element.token !== req.token)
        // console.log(req.user)
        await req.user.save()
        res.send('Successfully logged out of this particular session!')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/user/me/logoutAll', auth , async (req, res) => {
    // console.log(req.token)
    try{
        req.user.tokens = []
        req.user.save()
        res.send('Successfully logged out of all the sessions!')
    } catch ( error ) {
        res.status(400).send('Could not log out of all the sessions')
    }
})

module.exports = {
    router
}