const request = require('request');
var constants = require("../constants");

getId=async (req, callbackfunc)=>{
	//url
	const url = 'https://api.test.paysafe.com/paymenthub/v1/customers';
  	//body
	var values = {
					merchantCustomerId: req.email+req.firstName+req.phone+"1234567",
					firstName: req.firstName,
					email: req.email,
					phone: req.phone,
				}
	//options for post request
	const options = {
				  url: url,
				  headers: constants.headers,
				  body: JSON.stringify(values),
   				  method: 'POST'
				};
	 function callback(error, response, body) {
		console.log(JSON.parse(body).id)
		return callbackfunc(JSON.parse(body).id);
	}			
	
	  request(options, callback);			
};

module.exports.getId = getId;

