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

exports. add_lift_user = function (personal_info,gallagher_id,lift_groups)
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
                var data = JSON.stringify({"gateway_id":"","jdata":{"command":"addUser_setZoneAccess","device_id":"","parameter":{"personID":""+gallagher_id+"","familyName":""+personal_info['lastname']+"","firstName":""+personal_info['firstname']+"","company":"","enterprise":"","department":"","profileName":"","badgeNo1":"AB0000000012345678","badgeNo2":"","badgeNo3":"","entryDate":"","exitDate":"","autoZone":"specific,5,1","accessZonesAlways":"1,2,3,4,5,6,7,8,9,10"}}});
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
                    var myarray=[];
                    myarray.push({"SL":{"person_id":gallagher_id}});
                    resolve(myarray);
                   }else{
                    resolve(2);
                   }
               
               }else{
                resolve(2); 
               }
                  
                  
    
                }else{
                    console.log("No adding");
                }
    
            });
        }catch(error)
        {
           console.log(error);
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
exports. delete_lift_user = function (lift_id)
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
                var data = JSON.stringify({"gateway_id":"","jdata":{"command":"deleteUser","device_id":"","parameter":{"personID":""+lift_id+""}}});
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
                if(response.data.data['status']=='success')  {
                resolve(true); 
    
                }else{
                    resolve(false); 
                }
    
            });
        }catch(error)
        {
            resolve(false); 
        }
           }else{
            resolve(false); 
           }
         
              

            }else{
                resolve(false); 
            }

        });
    }catch(error)
    {
        resolve(error);
    }
  
    });
          
    
}