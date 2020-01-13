const express = require('express')
const {Tasks} = require('../model/tasks.js')
const  {auth} = require('../auth/auth')

const router = new express.Router()


router.post('/task', auth, async (req, res) => {
    console.log(req.body)
    try {
        const task = new Tasks({
            ...req.body,
            owner: req.user._id
        })

        await task.save()
        res.send(task) 
    } catch (error) {
        res.status(400).send('ogh! there was something wrong with storing the tasks..')
    }
})

router.get('/task/:id', auth,  async (req, res) => {
    console.log(req.body)
    const _id = req.params.id

    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id})
        console.log(task)
        if(!task) {
            throw new Error('Hello Looks like the task with this particular id could not be found!')
        }
        res.send(task)
    } catch (error) {
        res.status(400).send({error, errorMessage: 'Looks like the task with this particular id could not be found!'})
    }
})

router.get('/tasks', auth, async (req, res) => {
    console.log(req.body)
    try {
        const tasks = await Tasks.find({owner : req.user._id})

        if(!tasks) {
            return res.status(404).send('Sorry but no tasks could be found with this owner.')
        }
        res.send(tasks)
    }catch (error ) {
        res.status(400).send(error)
    }
})

router.patch('/task/:id' , auth, async (req, res) => {
    console.log(req.body)
    try {   
        const updatedTask = await Tasks.findOneAndUpdate({ _id: req.params.id , owner: req.user._id}, req.body, {new: true, useValidators: true})
        if(!updatedTask) {
            return res.status(404).send('ooops, no such task could be updated!')
        }
        res.send(updatedTask)
    } catch(error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try{
        console.log(req.body)
        const deletedTask = await Tasks.findOneAndDelete({_id: req.params.id , owner: req.user._id})
        if(!deletedTask) {
            return res.status(404).send('OOps, no such task could be deleted!')
        }      
        res.send(deletedTask)
    }catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

module.exports = {
    router
}