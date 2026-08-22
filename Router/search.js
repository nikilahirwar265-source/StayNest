const express = require('express');
const router = express.Router();

const listings = require('../models/listing.js');
const searchController = require("../controller/search.js");

router.get("/", searchController.searchBar);

module.exports = router;