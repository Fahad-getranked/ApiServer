const express= require("express");
const axios = require('axios');
var bodyParser = require('body-parser');

var constants=require("../constants.js");
var gr_mod = require('../modules/gallagher_module');
const https=require("https");
var apiKey;
var extagent;
var extagent;

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
apiKey =constants.GALLAGHER_KEY;
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
//================================USERS SECTION================================
	exports.save_user_in_gallagher = function(personal_info,cardtypes,access_groups)
	{	
	var carddetails=[];
	var accessgroupdetails=[];
		for(var i=0;i<cardtypes.length;i++)
		{
			if(cardtypes[i]['is_mobile_card']!="mobile"){
				var cards={		
					"type": {
					  "href": constants.GALLAGHER_HOST+'/api/card_types/'+cardtypes[i]['card_type']
					},
					"status": {
					  "value": "Active",
					  "type":"active"
					},
					"number":cardtypes[i]['card_number'],
					"from": new Date(cardtypes[i]['valid_from']).toISOString(),
					"until": new Date(cardtypes[i]['valid_to']).toISOString()
				  }
				  carddetails.push(cards);
			}else{
				var cards={		
					"type": {
					  "href": constants.GALLAGHER_HOST+'/api/card_types/'+cardtypes[i]['card_type']
					},
					"status": {
					  "value": "Active",
					  "type":"active"
					},
					 "invitation":{
					 "email":personal_info['email'],
					//"singleFactorOnly"=> true
					 },
					 "from": new Date(cardtypes[i]['valid_from']).toISOString(),
					 "until": new Date(cardtypes[i]['valid_to']).toISOString()
				  }
				  carddetails.push(cards);
			}
		}
		
		access_groups=access_groups.split(',');
		
		for(var i=0;i<access_groups.length;i++)
		{
			var vals={			
				"accessgroup": {
					"href" : constants.GALLAGHER_HOST+'/api/access_groups/'+access_groups[i]
				},	   
			  }
			  accessgroupdetails.push(vals);
		}
		
		return new Promise((resolve) => {
			try {
			
	  var imges=get_user_image(personal_info['photo']);
		 imges.then(profileimage=>{
		   
		let obj = {
			"authorised": true,
			'firstName' : personal_info['firstname'],
			'lastName'  :personal_info['lastname'],
			'description':'',
			'division' : {
				'href' : constants.GALLAGHER_HOST+'/api/divisions/'+personal_info['division']
			},
			'@photo':profileimage,
			'@email':personal_info['email'],
			'@phone':personal_info['phone'],
	
			  "cards":carddetails,
			  "accessGroups": accessgroupdetails
		
			  
		};
		var url=constants.GALLAGHER_HOST+'/api/cardholders';
		axios({
			method: 'post', 
			 httpsAgent: extagent,
			url: url,
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
				var interval = setInterval(function() {
				var cardholder_detail=gr_mod.get_cardholder_details(cardholder_id);
				cardholder_detail.then(rest=>{
                    if(rest){ 
					resolve(rest);
clearInterval(interval);
					}

				});
			}, 600);
			  
			}else{
				var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
			}
		}).catch(error =>  {
		
			var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
			});
		});
		}catch(error)
		{
			
			var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
		}
		});
		
		
	
	
	
	}	
	exports.get_cardholder_details = function(card_holder_id)
	{
try{
		return new Promise((resolve) => {
			try {  
		
				var url=constants.GALLAGHER_HOST+'/api/cardholders/'+card_holder_id;
		axios({
			method: 'GET', 
			 httpsAgent: extagent,
			url: url,
			//data : obj,
			headers: {
				  'Authorization': apiKey,
				  'Content-Type' : 'application/json'
				}
			})
		.then(function (response){
			if(response.status==200)
					{
			var myarray=[];
			var array_cards=[];
			
      try{
for(var i=0;i<response.data.cards.length;i++)
{
	var p=response.data.cards[i].href;
	card_id=p.match(/([^\/]*)\/*$/)[1];	
	var sy=response.data.cards[i].type.href;
	var card_type=sy.match(/([^\/]*)\/*$/)[1];
	var status=response.data.cards[i].status.value;
	if(response.data.cards[i].credentialClass=="mobile")
	{
	 var cx=response.data.cards[i].invitation.href;
	
	var code=cx.match(/([^\/]*)\/*$/)[1];
	var cards={
	   'card_id':card_id,
	   'card_type':card_type,
	   'invitation_code':code,
	   "device_code":"GG",
	   'status':status
	}
	array_cards.push(cards);
	}else{
		var cards={
			'card_id':card_id,
			'card_type':card_type,
			'invitation_code':0,
			"device_code":"GG",
			'status':status
		 }
		 array_cards.push(cards);


	}
	
}
	  }
	  catch(error)
	  {
		 // console.log("Exception");
	  }
myarray.push({"GG":{"person_id":response.data.id,"message":"success","cards":{array_cards}}});
resolve(myarray);

					}
			else{
				resolve(2);
			}
				
					
			
		}).catch(error =>  {
				//console.log(error)
			});
	
		}catch(error)
		{
			//console.log(error);
		}
		});
	}catch(error)
	{
		resolve(2);
	}
	}
	exports.delete_cardholder_details = function(card_holder_id)
	{

		return new Promise((resolve) => {
			try {  
		
				var url=constants.GALLAGHER_HOST+'/api/cardholders/'+card_holder_id;
		axios({
			method: 'DELETE', 
			 httpsAgent: extagent,
			url: url,
			//data : obj,
			headers: {
				  'Authorization': apiKey,
				  'Content-Type' : 'application/json'
				}
			})
		.then(function (response){
		
			resolve(true);
			
				
					
			
		}).catch(error =>  {
			resolve(false);
			});
	
		}catch(error)
		{
			resolve(false);
		}
		});
	}
	exports.delete_card_details = function(card_holder_id,card_id)
	{
		return new Promise((resolve) => {
			try {  	
				var url=constants.GALLAGHER_HOST+'/api/cardholders/'+card_holder_id+'/cards/'+card_id;
		axios({
			method: 'DELETE', 
			 httpsAgent: extagent,
			url: url,
			//data : obj,
			headers: {
				  'Authorization': apiKey,
				  'Content-Type' : 'application/json'
				}
			})
		.then(function (response){
		
			resolve(true);
			
				
					
			
		}).catch(error =>  {
			resolve(false);
			});
	
		}catch(error)
		{
			resolve(false);
		}
		});
	}

	exports.delete_access_group_details = function(card_holder_id,group_id)
	{
		return new Promise((resolve) => {
			try {  	
		var url=constants.GALLAGHER_HOST+'/api/cardholders/'+card_holder_id+'/access_groups/'+group_id;
		axios({
			method: 'DELETE', 
			 httpsAgent: extagent,
			url: url,
			//data : obj,
			headers: {
				  'Authorization': apiKey,
				  'Content-Type' : 'application/json'
				}
			})
		.then(function (response){
		
			resolve(true);
			
				
					
			
		}).catch(error =>  {
			resolve(false);
			});
	
		}catch(error)
		{
			resolve(false);
		}
		});
	}
//=========================FOR USER AND VISITORS===================
	exports.update_card_status = function(firstname,lastname,card_holder_id,cardtypes)
	{
		var carddetails=[];
	
			for(var i=0;i<cardtypes.length;i++)
			{
				
				var cards={		
					"href": constants.GALLAGHER_HOST+'/api/cardholders/'+card_holder_id+'/cards/'+cardtypes[i]['card_external_id'],
							 "status": {
							   "value": cardtypes[i]['status'],
							 },
							  "from": new Date(cardtypes[i]['valid_from']).toISOString(),
							  "until": new Date(cardtypes[i]['valid_to']).toISOString()
							}
				  carddetails.push(cards);
				}
		return new Promise((resolve) => {
			try { 
				let obj = {
					"authorised": true,
					'firstName' : firstname,
					'lastName'  :lastname,
					"cards": {
					  "update":carddetails
					}
							  
				}; 	
		var url=constants.GALLAGHER_HOST+'/api/cardholders/'+card_holder_id;
	
		
		axios({
			method: 'PATCH', 
			 httpsAgent: extagent,
			url: url,
			data : obj,
			headers: {
				  'Authorization': apiKey,
				  'Content-Type' : 'application/json'
				}
			})
		.then(function (response){
		
			resolve(true);
			
				
					
			
		}).catch(error =>  {
			resolve(false);
			});
	
		}catch(error)
		{
			resolve(false);
		}
		});
	}
//=======================================================================

	exports.add_cards_and_groups_in_gallagher = function(card_holder_id,cardtypes,access_groups)
	{
		
	var carddetails=[];
	var accessgroupdetails=[];
		for(var i=0;i<cardtypes.length;i++)
		{
			if(cardtypes[i]['is_mobile_card']!="mobile"){
			var cards={		
				"type": {
				  "href": constants.GALLAGHER_HOST+'/api/card_types/'+cardtypes[i]['card_type']
				},
				"status": {
				  "value": "Active",
				  "type":"active"
				},
				 "invitation":{
				 "email":personal_info['email'],
				//"singleFactorOnly"=> true
				 },
				 "from": cardtypes[i]['valid_from'],
				 "until": cardtypes[i]['valid_to']
			  }
			  carddetails.push(cards);
			}else{
				var cards={		
					"type": {
					  "href": constants.GALLAGHER_HOST+'/api/card_types/'+cardtypes[i]['card_type']
					},
					"number":cardtypes[i]['card_number'],
					"from": cardtypes[i]['valid_from'],
					"until": cardtypes[i]['valid_to'],
					"status": {
					  "value": "Active",
					  "type":"active"
					},
				  
				  }
				  carddetails.push(cards);
			}
		}
		
		access_groups=access_groups.split(',');
		for(var i=0;i<access_groups.length;i++)
		{
			var vals={			
				"accessgroup": {
					"href" : constants.GALLAGHER_HOST+'/api/access_groups/'+access_groups[i]
				},	   
			  }
			  accessgroupdetails.push(vals);
		}
		return new Promise((resolve) => {
			try {  
		let obj = {
			"cards": {
			  "add":cardtypes
			},
			"accessGroups": {
				"add": access_groups
			}
					  
		};
		var url=constants.GALLAGHER_HOST+'/api/cardholders/'+card_holder_id;
		axios({
			method: 'PATCH', 
			 httpsAgent: extagent,
			url: url,
			data : obj,
			headers: {
				  'Authorization': apiKey,
				  'Content-Type' : 'application/json'
				}
			})
		.then(function (response){
			//console.log(response);
				
				resolve(true);	
			
		}).catch(error =>  {
			resolve(3);
			});
	
		}catch(error)
		{
			resolve(3);
		}
		});
	}
//======================================VISITORS SECTION============================
//==================================================================================
exports.save_visitor_in_gallagher = function(personal_info,cardtypes,access_groups)
{
	
var carddetails=[];
var accessgroupdetails=[];
	for(var i=0;i<cardtypes.length;i++)
	{
		if(cardtypes[i]['is_mobile_card']!="mobile"){
			var cards={		
				"type": {
				  "href": constants.GALLAGHER_HOST+'/api/card_types/'+cardtypes[i]['card_type']
				},
				"status": {
				  "value": "Active",
				  "type":"active"
				},
				"number":cardtypes[i]['card_number'],
				"from": new Date(cardtypes[i]['valid_from']).toISOString(),
				"until": new Date(cardtypes[i]['valid_to']).toISOString()
			  }
			  carddetails.push(cards);
		}
	}
	
	access_groups=access_groups.split(',');
	
	for(var i=0;i<access_groups.length;i++)
	{
		var vals={			
			"accessgroup": {
				"href" : constants.GALLAGHER_HOST+'/api/access_groups/'+access_groups[i]
			},	   
		  }
		  accessgroupdetails.push(vals);
	}
	
	return new Promise((resolve) => {
		try {
		
  var imges=get_user_image(personal_info['photo']);
     imges.then(profileimage=>{
       
	let obj = {
		"authorised": true,
		'firstName' : personal_info['firstname'],
		'lastName'  :personal_info['lastname'],
		'description':'',
		'division' : {
			'href' : constants.GALLAGHER_HOST+'/api/divisions/'+personal_info['division']
		},
		'@photo':profileimage,
		'@email':personal_info['email'],
		'@phone':personal_info['phone'],

		  "cards":carddetails,
		  "accessGroups": accessgroupdetails
	
		  
	};
	var url=constants.GALLAGHER_HOST+'/api/cardholders';
	axios({
		method: 'post', 
		 httpsAgent: extagent,
		url: url,
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
	
			var myarray=[];
			myarray.push({"GG":{"person_id":cardholder_id,"message":"success"}});
			resolve(myarray);
				
	
          	
		}else{
			var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
        }
	}).catch(error =>  {
		var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
		});
	});
	}catch(error)
	{
		var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
	}
	});
	
	



}

