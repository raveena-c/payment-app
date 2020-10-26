const request = require('request');
var constants = require("../constants");

getToken=async (payid, callbackfunc)=>{
	//url
	const url = 'https://api.test.paysafe.com/paymenthub/v1/customers';
  	//body
	var values = {
					"merchantRefNum": "Ref123",
					"paymentTypes": [
						"CARD"
					]
				}		
	//options
	const options = {
				  url: 'https://api.test.paysafe.com/paymenthub/v1/customers/' + payid + '/singleusecustomertokens',
				  headers:constants.headers,
				  body: JSON.stringify(values),
   				  method: 'POST'
				};
	//callback for requests	
	 function callback(error, response, body) {
		// console.log(error)
		console.log(JSON.parse(body).singleUseCustomerToken)
		return callbackfunc(JSON.parse(body).singleUseCustomerToken);
	}			
	
	  request(options, callback);			
};

module.exports.getToken = getToken;