const math = require('mathjs');

module.exports.calculate = function(req, res){
	// get equation from request
	eq=req.body.eq;
	error="";

	// calculate
	try {
		result=math.eval(eq);
	}
	catch (err) {
		result='ERR';
		error=err.message;
	}

	// put in history
	entry = {
		time: Date.now(),
		eq: eq,
		result: result
	}
	req.app.locals.history.push(entry);

	// response
	if (!error){
		res.status(200).json({'result':result});
	} else {
		res.status(400).json({'result':result, 'error':error});
	}
}

module.exports.getLog = function(req, res){
	console.log(req.app.locals.history);
	res.status(200).json({'result':'lol'});
}