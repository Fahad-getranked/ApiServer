const express= require("express");
const axios = require('axios');

require ('custom-env').env('staging');
var qs = require('qs');
const https=require("https");
var apiKey;
var extagent;
var extagent;
var url;
var access_group=0;
var card_type=0;
const isAuthorized = (req, res, next) => {
	let authorization = true;
	if (authorization ) {
		console.log("authorization token found.")
		next();
	}
	else {
		console.log("authorization token not found.")
		next ("error")
	}	
}

const agent = new https.Agent({
    rejectUnauthorized: false
})
extagent=agent
function get_user_image(url){

	return new Promise((resolve) => {

		try{
			axios({
				method: 'get', 
				url: url,
				headers: {}
			})
			.then(function (response){
				
				resolve(response.data);	
			}).catch(error =>  {
					console.log(error)
			
			});
		}catch(error)
		{
				console.log(error);
		}
	});
		

}
exports. add_fr_user = function (firsname,lastname,description,division,picture,number,card_type,content2)
{
   
    
  
	return new Promise((resolve) => {
		try {
            
            var imges=get_user_image( picture);
            imges.then(profileimage=>{
                profileimage="";   
			var bodyparameters='{"personFamilyName":"'+lastname+'","personGivenName": "'+firsname+'","gender": 1,"orgIndexCode": "7","phoneNo": "03005263","faces": [{ "faceData": "'+profileimage+'"}],"cards":[{"cardNo": "'+number+'"}]}';
			var devicestring="ApiKey="+process.env.FR_KEY+"&MethodType=POST&ApiSecret="+process.env.FR_SECRET_KEY+"&IP="+process.env.FR_LOCAL_IP+"&PortNumber="+process.env.FR_PORT+"&ProtocolType="+process.env.FR_PROTOCOL+"&ApiMethod=/api/visitor/v1/auth/reapplication&BodyParameters={}";
			var signature="ApiKey="+process.env.FR_KEY+"&MethodType=POST&ApiSecret="+process.env.FR_SECRET_KEY+"&IP="+process.env.FR_LOCAL_IP+"&PortNumber="+process.env.FR_PORT+"&ProtocolType="+process.env.FR_PROTOCOL+"&ApiMethod=/api/resource/v1/person/single/add&BodyParameters="+bodyparameters;
			console.log(bodyparameters);
		
            var url=process.env.FR_HOST+'/api/FrData/';
        
            axios({
                method: 'POST', 
                httpsAgent: extagent,
                url: url,
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                data :signature,
            
                })
            .then(restp=>{
                if(restp.data.code==0)
                {
                    resolve(restp.data.data);
                    axios({
                        method: 'POST', 
                        httpsAgent: extagent,
                        url: url,
                        data :devicestring,
                    
                        })
                    .then(function (restp){
                
                    if(restp.data.code==0)
                    {			
                
                    }else{
                    
                    }
                    
                    }).catch(error =>  {
                        console.log(error);
                    });

                }
            });
            });
        }catch(error)
        {
            console.log(error);
        }
  
    });
}