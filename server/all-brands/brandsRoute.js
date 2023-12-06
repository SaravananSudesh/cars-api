const express = require('express');

const router = express.Router()

//Controllers Import
const brandsController = require('./brandsController')

//Routes
router.get('/getAllBrandsName', brandsController.getAllBrandsName)

module.exports = router