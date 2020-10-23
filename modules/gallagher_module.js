const express= require("express");
const axios = require('axios');
var bodyParser = require('body-parser');
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
apiKey =process.env.GALLAGHER_KEY;
extkey=apiKey;
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
exports.save_user_in_gallagher = function(firsname,lastname,description,division,picture,number,card_type)
{
	
	return new Promise((resolve) => {
		try {
		
            var imges=get_user_image(picture);
            imges.then(profileimage=>{
               
           
           
	let obj = {
		'firstName' : firsname,
		'lastName'  :lastname,
		'authorized' : true,
		'description':description,
		'division' : {
			'href' : process.env.GALLAGHER_HOST+'/api/divisions/'+division
		},
		'@photo':profileimage,
		"cards": [
			{
		
			  "type": {
				//"href": "https://localhost:8904/api/card_types/"+card_type
				"href": process.env.GALLAGHER_HOST+'/api/card_types/'+card_type
			  },
			//   "number":number,
			//   "from": "2020-10-22 00:00:00",
			//   "until": "2021-10-22 00:00:00"
			}
		  ],
		
		"accessGroups": [
			{
				
			  "accessgroup": {
				  "href" : 'https://127.0.0.1:8904/api/access_groups/6546'
			  },
			 
			 
			}
		  ],
		  
	};
	
	axios({
		method: 'post', 
		 httpsAgent: extagent,
		url: process.env.GALLAGHER_HOST+'/api/cardholders/',
		data : obj,
		headers: {
			  'Authorization': apiKey,
			  'Content-Type' : 'application/json'
			}
		})
	.then(function (response){
		if (response.status == 201) {
			var valssss=response.headers.location;
			var cardholder_id=valssss.match(/([^\/]*)\/*$/)[1];	
            resolve(cardholder_id);	
		}else{
            console.log("error");
        }
	}).catch(error =>  {
            console.log(error)
		});
	});
	}catch(error)
	{
        console.log(error);
	}
	});
	
}