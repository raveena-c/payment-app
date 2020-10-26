const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
mongoose        = require("mongoose");
Customer = require("./models/customer");
var util = require("./utils/id");
var token = require("./utils/token");
var payment = require("./utils/payment");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var path = require('path');
const customer = require('./models/customer');

app.use(express.static(path.join(__dirname + '/views', '')));
mongoose.connect("mongodb://https://paysafe-payment-app.herokuapp.com:3000/paysafe");

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With , token");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Expose-Headers", "token");
    next();
});

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post("/token", function(req, res) {
	findpaysafe={
		"email":req.body.email
	}
	console.log(findpaysafe)
		//checking whether customer exists in database
		customer.find(findpaysafe, async function(err,paysafe){
			if(err){
				console.log(err);
			}else{
				if(paysafe.length==0){
					 await util.getId(req.body,
						 function(result){
							 // console.log(result);
							var newpaysafe={
								payid:result,
								email:req.body.email
							}
							console.log(newpaysafe)
							//creating customer in database
							customer.create(newpaysafe,async function(err, newCustomer){
								if(err){
									// console.log(err);
								} else {
									paysafe=newCustomer;
									console.log("paysafe**********",paysafe)
									await token.getToken(paysafe.payid,function(result){
									res.send({token:result});
								})
									// console.log("added",newlyCreated)
								}
							});
					 });	
				}else{
					console.log("paysafe",paysafe)
						await token.getToken(paysafe[0].payid,function(result){
						res.send({token:result});
					})
				}
			}
		});
	
    });
    
    app.post("/payment", async(req, res) => {
        console.log(req.body);
      await payment.onPay(req.body,function(result){
          res.send({data:result.status});
      });
  });

app.listen(port, () => console.log(`listening`));


