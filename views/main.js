public_api_key="cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=";

$(document).ready(function(){
    $("#paybutton").click(function(event){
        event.preventDefault();
        Pay();
    });
  });

  async function Pay(){
      //get data
        let email=document.getElementById("email").value;
        let firstName=document.getElementById("firstname").value;
        let lastName=document.getElementById("lastname").value;
        let phone=document.getElementById("phone").value;
        let city=document.getElementById("city").value;
        let zip=document.getElementById("zip").value;
        let amount=document.getElementById("amount").value;
        var token

        $.ajax({
            url: "https://paysafe-payment-app.herokuapp.com/token",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({'email': email,'phone':phone,'firstName':firstName})    
            , success: function(result){
                token=result.token;
            
            billingAddress={
                city:city,
                street:'abc',
                zip:zip,
                country:'US',
                state:'CA'
            }
            customer={
                firstName:firstName,
                lastName:lastName,
                email:email,
                phone:phone,
                dateOfBirth:{
                    day:1,
                    month:6,
                    year:1989
                }
            }
            
             function uuidv4() {
              return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
              });
            }
             checkout(token,billingAddress,customer,amount,uuidv4())
          }});

          function checkout(token,billingAddress,customer,amount,uuid) {
            paysafe.checkout.setup(public_api_key, {
                "currency": "USD",
                "amount": parseInt(amount)*100,
                "singleUseCustomerToken": token,
                
                "customer": customer,
                "billingAddress": billingAddress,
                "paymentMethodDetails": {
                    "paysafecard": {
                        "consumerId": "1232323"
                    },
                },
                "environment": "TEST",
                "merchantRefNum": uuid,
                "canEditAmount": false,
                "payout": false,
                "payoutConfig": {
                    "maximumAmount": 10000
                }
            }, function(instance, error, result) {
                if (result && result.paymentHandleToken) {
                    $.ajax({
                              type: "POST",
                              url: "https://paysafe-payment-app.herokuapp.com/payment",
                              contentType: "application/json",
                              data: JSON.stringify({'token': result.paymentHandleToken,'amount':result.amount},),
                              success: (data) =>{   
                                      
                                // show payment status             
                                
                                if(data.data == "COMPLETED"){
                                	 instance.showSuccessScreen("Payment Successful!");  
                                }
                                else{
                                  instance.showFailureScreen("Payment was declined. Please try again after some time."); 
                                }
                                 setTimeout(function(){window.location.replace(window.location.href);}, 5000);
                              }
                            });
                } else {
                  console.log("error");
                  alert("Please keep in mind -----"+error.detailedMessage)
                }
            }, function(stage, expired) {
                switch(stage) {
                    case "PAYMENT_HANDLE_NOT_CREATED": 
                    case "PAYMENT_HANDLE_CREATED": 
                    case "PAYMENT_HANDLE_REDIRECT": 
                    case "PAYMENT_HANDLE_PAYABLE": 
                    default: 
                }
            });
          }



		
					
  }



  
        


   