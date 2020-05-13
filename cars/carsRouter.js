const express = require('express');


const db = require('../data/dbConnection.js');

const router = express.Router();

//this is where I will do all CRUD for cars database.
router.get('/', (req, res)=>{
    db('cars')
    .then(cars =>{
        res.status(201).json(cars)
    })
    .catch(err =>{
        res.status(500).json({message: 'failed to find your database of cars'})
    })
})

router.get('/:id', (req, res)=>{
    const {id} = req.params
    db('cars')
    .where({id})
    .first()
    .then(cars =>{
        res.status(201).json(cars)
    })
    .catch(err =>{
        res.status(500).json({message: 'failed to find your database of cars'})
    })
})


router.post('/', (req, res)=>{
    const carData = req.body;
    if(isValid(carData)){
    db('cars').insert(carData)
    .then(ids =>{
        db('cars').where({id:ids[0]})
        .then(newCarEntry =>{
            res.status(201).json(newCarEntry)
        })
    }).catch(err =>{
        console.log('Post error:', err)
        res.status(500).json({message: 'failure to reach database of cars'})
    })
}else{
    res.status(400).json({message: "Vin, milage, make and model are all required to submit a new car to database"})
}
})

router.put('/:id', (req, res)=>{
    const {id} = req.params
    const updates = req.body
    if(isValid(updates)){
    db('cars')
    .where({id})
    .update(updates)
    .then(update =>{
        if(update > 0){
            res.status(200).json({data: update})
        }else{
            res.status(404).json({message: 'this car\'s specific id cannot be located or updated'})
        }
    })
    }else{
        res.status(400).json({message: 'please fill in the missing required field of either -> vin, make, model, or milage'})
    }
})


router.delete('/:id', (req, res)=>{
   let {id} = req.params
    db('cars')
    .where({id})
    .del()
    .then(destroyer =>{
        if(destroyer > 0){
            res.status(200).json({data: destroyer})
        }else{
            res.status(404).json({message: 'this car with this ID was not deleted'})
        }
    })
    .catch(err =>{
        res.status(500).json({message: 'error deleting from the database'})
    })
})

function isValid(car){
    return Boolean(car.vin && car.make && car.model && car.milage)
}




module.exports = router;