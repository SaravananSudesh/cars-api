const express = require('express');

const router = express.Router()

//Controllers Import
const carsController = require('./carsController')

//Routes
router.get('/getCarsByBrand/:brand', carsController.getCarsByBrand)
router.get('/getCarDetails/:brand/:name', carsController.getCarDetails)

module.exports = router