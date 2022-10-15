const router = require('express').Router();
const {getData} = require("../controllers")

router.get('/', getData);

module.exports = router