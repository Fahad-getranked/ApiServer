const express= require("express");
const axios = require('axios');

require ('custom-env').env('staging');
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

exports. add_lift_user = function (firsname,lastname,gallagher_id)
{
  
    return new Promise((resolve) => {
        try {
            var obj={
                'username':process.env.LOGIN_LIFT_USER,
                'password':process.env.LOGIN_LIFT_PASSWORD
            }
        axios({
            method: 'POST', 
            httpsAgent: extagent,
            url: process.env.LIFT_HOST+'/schindler/v1/api/login',
            headers: { 
                'Content-Type': 'application/json'
              },
            data :obj,
        
            })
        .then(response=>{
         if (response.status == 200) {
          if(response.data!='')
           {
            // resolve(response.data[0]['token']);
            try {
                var data = JSON.stringify({"gateway_id":"","jdata":{"command":"addUser","device_id":"","parameter":{"personID":""+gallagher_id+"","familyName":""+lastname+"","firstName":""+firsname+"","company":"","enterprise":"","department":"","profileName":"","badgeNo1":"AB0000000012345678","badgeNo2":"","badgeNo3":"","entryDate":"","exitDate":"","autoZone":"specific,5,1"}}});
            axios({
                method: 'POST', 
                httpsAgent: extagent,
                url: process.env.LIFT_HOST+'/schindler/v1/api/command',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer '+response.data[0]['token']
                  },
                data :data,
            
                })
            .then(response=>{
             if (response.status == 200) {
                if(response.data!='')
               {
                   if(response.data.data['status']=='success')
                   {
                    resolve(gallagher_id);
                   }else{
                    resolve(1);
                   }
               
               }else{
                resolve(1); 
               }
                  
                  
    
                }else{
                    resolve(2);
                }
    
            });
        }catch(error)
        {
            resolve(2);
        }
           }else{
            resolve(1); 
           }
         
              

            }else{
                resolve(1); 
            }

        });
    }catch(error)
    {
        resolve(error);
    }
  
    });
          
    
}
