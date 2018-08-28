var express = require('express');
var router = express.Router();

var ctrl = require('./controllers.js');

router.
	route('/calc').
	post(ctrl.calculate);

router.
	route('/log').
	get(ctrl.getLog);

module.exports = router;