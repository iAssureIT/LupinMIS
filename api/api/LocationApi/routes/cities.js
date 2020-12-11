const express 	= require("express");
const router 	= express.Router();

const CitiesController = require('../controllers/cities');

router.get('/get/list/:countryCode/:stateCode/:districtName/:blockName', CitiesController.getCities);

router.get('/get/citieslist/:countryID/:stateID/:districtID/:blockID', CitiesController.getCitiesWithId);

router.get('/get/villagelist/:countryID/:stateID/:districtID/:blockID', CitiesController.getVillagelist);

router.post('/get/villagelist', CitiesController.getpostVillagelist);

router.get('/get/citiesByState/:countryCode/:stateCode', CitiesController.getCitiesByState);

router.post('/post/addCity',CitiesController.addCity);

router.post('/post/bulkinsert', CitiesController.bulkinsert);

router.get('/get/filedetails/:fileName',CitiesController.filedetails);

router.delete('/:villageID', CitiesController.deleteCity);

module.exports = router;  