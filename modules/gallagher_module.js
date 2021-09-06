const express= require("express");
const axios = require('axios');
var bodyParser = require('body-parser');

var constants=require("../constants.js");
var cron_mod = require('../modules/cron_module');
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
				httpsAgent: extagent,
				url: url,
				headers: {}
			})
			.then(function (response){
				
				resolve(response.data);	
			}).catch(error =>  {
				resolve('');
					console.log(error)
			
			});
		}catch(error)
		{
		    	resolve('');
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
				cron_mod.save_logs_into_db('GG','ADD','User '+ personal_info['firstname']+' '+personal_info['lastname']+' added successfully',1);
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
			}, 900);
			  
			}else{
				
				var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
			}
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
			var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
			});
		});
		}catch(error)
		{
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
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
			cron_mod.save_logs_into_db('GG','DELETE','User #'+card_holder_id+' deleted successfully',1);
			resolve(true);
			
				
					
			
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','DELETE',error.response.data.message,0);
			resolve(false);
			});
	
		}catch(error)
		{
			cron_mod.save_logs_into_db('GG','DELETE',error.response.data.message,0);
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
			cron_mod.save_logs_into_db('GG','DELETE','User card #'+card_id+' deleted successfully',1);
			var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"success"}});
			resolve(myarray)
			
				
					
			
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','DELETE',error.response.data.message,0);
			var myarray=[];
			myarray.push({"GG":{"person_id":1,"message":"failed"}});
			resolve(myarray)
			});
	
		}catch(error)
		{
			cron_mod.save_logs_into_db('GG','DELETE',error.response.data.message,0);
			var myarray=[];
			myarray.push({"GG":{"person_id":1,"message":"failed"}});
			resolve(myarray)
		}
		});
	}

	exports.delete_access_group_details = function(card_holder_id,group_id)
	{
	  	
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
		
			cron_mod.save_logs_into_db('GG','DELETE','Access Group #'+group_id+' deleted successfully',1);
			
				
					
			
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','DELETE',error.response.data.message,0);
			});
	
		
	}
//=========================FOR USER AND VISITORS===================
	exports.update_card_status = function(firstname,lastname,photo,card_holder_id,cardtypes)
	{
	var imges=get_user_image(photo);
     imges.then(profileimage=>{
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
					'@photo':profileimage,
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
			cron_mod.save_logs_into_db('GG','UPDATE',firstname+' '+lastname+ ' card successfully updated',1);
			resolve(true);
			
				
					
			
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','UPDATE',error.response.data.message,0);
			resolve(false);
			});
	
		}catch(error)
		{
			cron_mod.save_logs_into_db('GG','UPDATE',error.response.data.message,0);
			resolve(false);
		}
		});
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
	exports.add_new_card_in_gallagher = function(card_holder_id,cardtypes)
	{
		console.log(card_holder_id);
	var carddetails=[];
	
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
					 "email":cardtypes[i]['email'],
					//"singleFactorOnly"=> true
					 },
					 "from": new Date(cardtypes[i]['valid_from']).toISOString(),
					 "until": new Date(cardtypes[i]['valid_to']).toISOString()
				  }
				  carddetails.push(cards);
				}
		}
		
		
		return new Promise((resolve) => {
			try {  
		let obj = {
			"authorised": true,
			"cards": {
			  "add":carddetails
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
			if(response)
			{
				
				var interval = setInterval(function() {
				var cardholder_detail=gr_mod.get_cardholder_details(card_holder_id);
				cardholder_detail.then(rest=>{
                    if(rest){
						cron_mod.save_logs_into_db('GG','ADD','User#'+card_holder_id+' card successfully added',1); 
					resolve(rest);
clearInterval(interval);
					}

				});
			}, 900);
			}else{
				var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
			}
				
				
			
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
			var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
			});
	
		}catch(error)
		{
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
			var myarray=[];
				myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
				resolve(myarray);
		}
		});
	}
	exports.add_new_groups_in_gallagher = function(card_holder_id,access_groups)
	{
		
	
	var accessgroupdetails=[];
		
		
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
		console.log(access_groups);
		return new Promise((resolve) => {
			try {  
				let obj = {
					"authorised": true,
					"accessGroups": {
					  "add":accessgroupdetails
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
			cron_mod.save_logs_into_db('GG','ADD','User#'+card_holder_id+' access group successfully added',1);
				resolve(true);	
			
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
			var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
			resolve(false);	
			});
	
		}catch(error)
		{
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
			resolve(false);	
		}
		});
	}
exports.get_cardholder_group_details = function(card_holder_id)
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
		  if(response.data.accessGroups){
			var count=0; 
for(var i=0;i<response.data.accessGroups.length;i++)
{
	count++;
	var p=response.data.accessGroups[i].href;
	var group_id=p.match(/([^\/]*)\/*$/)[1];	
	
	gr_mod.delete_access_group_details(card_holder_id,group_id);
	console.log("This group deleted.."+group_id);
	
}
    var intervalxxx = setInterval(function() {
console.log(response.data.accessGroups.length+"   "+count);
		if(response.data.accessGroups.length==count)
		{
			resolve(true);
			clearInterval(intervalxxx);
		}else{
			resolve(false);
		}
      
    }, 500);


		  }else{
			resolve(true);
		  }
		 
	 
	 

					
		}else{
				resolve(true);
			}
				
					
			
		}).catch(error =>  {
			resolve(false);
			});
	
		}catch(error)
		{
			//console.log(error);
		}
		});
	}catch(error)
	{
		resolve(false);
	}
	}
	//===========open the door===================
	exports.open_the_door = function(door_id)
	{	
		console.log('Open the door => '+door_id);
		return new Promise((resolve) => {
			try {  

				var config = {
					method: 'post',
					httpsAgent: extagent,
					url: constants.GALLAGHER_HOST+'/api/doors/'+door_id+'/open',
					headers: { 
					  'Authorization': constants.GALLAGHER_KEY
					}
				};
				axios(config)
				.then(function (response) {
					
					if(response.status==204) {
						resolve(true);
					}else{
						resolve(false);
					}
				})
				.catch(function (error) {
					resolve(false);
				});
				// let obj = {
				// 	"eventType": 1,
				// 	"eventID": 0,
				// 	"hasRestoral": 0,
				// 	"itemID": door_id,
				// 	"message": "Security Guard has opened door manually",
				// 	"details": "door open" 
				// };
		  		// console.log(obj);
				// var url=constants.EXTERNAL_SYSTEM_URL+'/api/Event/logEvent';
				// axios({
				// 	method: 'POST', 
				// 	httpsAgent: extagent,
				// 	url: url,
				// 	data : obj,
				// 	headers: {
				// 		'Content-Type' : 'application/json'
				// 		}
				// 	})
				// .then(function (response){
				// 	if(response.status==200)
				// 	{
				// 	resolve(true);
				// 	}else{
				// 		resolve(false);
				// 	}
						
						
					
				// }).catch(error =>  {
				
				// 	resolve(false);
				// });
	
			}catch(error) {
				
				resolve(false);
			}
		});
	}
	//===========acknowledge_alarm============
	exports.acknowledge_alarm_by_id = function(alarm_id)
	{
	
		return new Promise((resolve) => {
			try {  
				let obj = {
					"authorised": true,
					
				};
	
		var url=constants.GALLAGHER_HOST+'/api/alarms/'+alarm_id+'/acknowledge';
		axios({
			method: 'POST', 
			 httpsAgent: extagent,
			url: url,
			data : obj,
			headers: {
				  'Authorization': apiKey,
				  'Content-Type' : 'application/json'
				}
			})
		.then(function (response){
			if (response.status == 200) {
			cron_mod.save_logs_into_db('GG','ADD','Alarm acknowledged successfully',1);
				resolve(true);
			}else{
				cron_mod.save_logs_into_db('GG','ADD','invalid record:Alarm not acknowledged',0);
				resolve(false);
			}	
			
		}).catch(error =>  {
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
			resolve(false);	
			});
	
		}catch(error)
		{
			cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
			resolve(false);	
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
			cron_mod.save_logs_into_db('GG','ADD','User '+personal_info['firstname']+' '+personal_info['lastname']+' added successfully',1); 
			var myarray=[];
			myarray.push({"GG":{"person_id":cardholder_id,"message":"success"}});
			resolve(myarray);	
		}else{
			var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
        }
	}).catch(error =>  {
		cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
		var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
		});
	});
	}catch(error)
	{
		cron_mod.save_logs_into_db('GG','ADD',error.response.data.message,0);
		var myarray=[];
			myarray.push({"GG":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
	}
	});
	
	



}

