const express= require("express");
const axios = require('axios');
var constants=require("../constants.js");
var BIOSTAR = require('../modules/biostart_module');
const fs=require("fs");
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

exports.get_bs_scan_finger=function(token,device_id)
{
	console.log("FINGER SCANNING");
    var obj = [];
        return new Promise((resolve) => {
            try {
              var obj={
				"enroll_quality":constants.FingerScanQuality,
				"retrieve_raw_image": true
			  }
            axios({
                method: 'POST', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/devices/'+device_id+'/scan_fingerprint',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:obj,
            
                })
            .then(response=>{
			
				
                if(response.status==200)
                {
					console.log('INSIDE THE ADDRESS');
					var obj={
						 'image':response.data.template_image0,
						 'template':response.data.template0
					}
				resolve(obj);
                 
				}
			
				else{
					resolve(3);
                }
        
    
            }).catch(error=>{
				if(error.response.status==401)
				{
					resolve(2);
				}else{
					resolve(4);
				}
				
            });
        }catch(error)
        {
           resolve(1);
        }
      
        });
   
    
}
exports.add_user_in_biostart=function(token,personal_info,finger_prints)
{
    var obj = [];
        return new Promise((resolve) => {
			var beginTimey=formatDate(new Date(personal_info['valid_from']));
            var endTimey=formatDate(new Date(personal_info['valid_to']));
            try {
              var obj={
				"access_groups": [{
					"id": personal_info['group']
				}],
				"email": personal_info['email'],
			   "start_datetime":beginTimey,
			   "expiry_datetime":endTimey,
				"name": personal_info['full_name'],
				"phone_number": personal_info['phone'],
				"security_level": "1",
				"user_group": {
				  "id": 1
				},
			    "status": "AC",
				"user_id": personal_info['person_code']
			  }
            axios({
                method: 'POST', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/users',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:obj,
            
                })
            .then(response=>{
                if(response.status==201)
                {
					var mycard_id=BIOSTAR.add_csn_card(token,personal_info['card_no']);
					mycard_id.then(resps=>{
					 if(resps!=0)
					 {
						BIOSTAR.assign_card_to_bio_user(token,response.data.user_id,resps);
						var imges=get_user_image(personal_info['photo']);
							imges.then(profileimage=>{
								var imagesy=profileimage.replace(/\s/g, '');
								BIOSTAR.assign_image_to_bio_user(token,response.data.user_id,imagesy)
							});
					BIOSTAR.assign_fingerprint_to_bio_user(token,response.data.user_id,finger_prints);
					 }
						

					});
				 var myarray=[];
				 myarray.push({"BS":{"person_id":response.data.user_id,"message":"success"}});
				 resolve(myarray);
				}
				else if(response.status==500)
                {
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
                     
				}
				else{
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
                }
        
    
            }).catch(error=>{
				if(error.response.status==401)
				{
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
				}else{
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
				}
				
            });
        }catch(error)
        {
			var myarray=[];
			myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
        }
      
        });
   
    
}
exports.update_user_in_biostart=function(token,personal_info)
{
	var beginTimey=formatDate(new Date(personal_info['valid_from']));
      var endTimey=formatDate(new Date(personal_info['valid_to']));
    var obj = [];
        return new Promise((resolve) => {
            try {
              var obj={
				"access_groups": [],
				"email": personal_info['email'],
			   "start_datetime":beginTimey,
			   "expiry_datetime":endTimey,
				"name": personal_info['full_name'],
				"phone_number": personal_info['phone'],
				"security_level": "1",
				"user_group": {
				  "id": personal_info['group']
				},
			    "status": "AC",
				"user_id": personal_info['person_code']
			  }
            axios({
                method: 'PUT', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/users/'+personal_info['person_code'],
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:obj,
            
                })
            .then(response=>{
                if(response.status==200)
                {
				 var myarray=[];
				 myarray.push({"BS":{"person_id":personal_info['person_code'],"message":"success"}});
				 resolve(myarray);
				}
				else if(response.status==500)
                {
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
                     
				}
				else{
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
                }
        
    
            }).catch(error=>{
				if(error.response.status==401)
				{
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
				}else{
					var myarray=[];
					myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
					resolve(myarray);
				}
				
            });
        }catch(error)
        {
			var myarray=[];
			myarray.push({"BS":{"person_id":0,"message":"Invalid Request"}});
			resolve(myarray);
        }
      
        });
   
    
}
//===================ADD CARD IF NOT EXIST=========
exports.add_csn_card=function(token,card_no)
{
    var obj = [];
        return new Promise((resolve) => {
            try {
              var obj={
				"card_id":card_no
			  }
            axios({
                method: 'POST', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/cards/csn_card',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:obj,
            
                })
            .then(response=>{
			
                if(response.status==201)
                {
					
				resolve(response.data.id);
                 
				}
			
				else{
					resolve(0);
                }
        
    
            }).catch(error=>{
				if(error.response.status==401)
				{
					resolve(0);
				}else if(error.response.status==500)
				{
					var oldnumber=BIOSTAR.get_csn_card(token,card_no);
					oldnumber.then(restp=>{
						resolve(restp);
					})
					

				}
					else{
					resolve(0);
				}
				
            });
        }catch(error)
        {
           resolve(0);
        }
      
        });
   
    
}
exports.get_csn_card=function(token,card_no)
{
	
    var obj = [];
        return new Promise((resolve) => {
            try {
             
            axios({
                method: 'GET', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/cards/unassigned?text='+card_no+'&card_type=csn&limit=1&offset=0',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:obj,
            
                })
            .then(response=>{
                if(response.status==200)
                {
				
				resolve(response.data.records[0].id);
                 
				}
				
				else{
					resolve(0);
                }
        
    
            }).catch(error=>{
				resolve(0);
				
            });
        }catch(error)
        {
			resolve(0);
        }
      
        });
   
    
}

//======================ASSIGN CARD TO USER========
exports.assign_card_to_bio_user=function(token,user_id,card_id)
{

  
        return new Promise((resolve) => {
            try {
              var obj={
				"card_list": [
				  {
				
			  "id":card_id
				  }
				]
			  }
            axios({
                method: 'PUT', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/users/'+user_id+'/cards',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:obj,
            
                })
            .then(response=>{
			
                if(response.status==201)
                {
				
				resolve(1);
                 
				}
				
				else{
					resolve(0);
                }
        
    
            }).catch(error=>{
				console.log(error);
				if(error.response.status==401)
				{
					resolve(0);
				}
					else{
					resolve(0);
				}
				
            });
        }catch(error)
        {
           resolve(0);
        }
      
        });
   
    
}
exports.assign_image_to_bio_user=function(token,user_id,image)
{

  
        return new Promise((resolve) => {
            try {

			
            axios({
                method: 'PUT', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/users/'+user_id+'/photo',
                headers: { 
                    'Content-Type': 'application/octet-stream',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:image,
            
                })
            .then(response=>{
			
                if(response.status==201)
                {
				
				resolve(1);
                 
				}
				
				else{
					resolve(0);
                }
        
    
            }).catch(error=>{
				console.log(error);
				if(error.response.status==401)
				{
					resolve(0);
				}
					else{
					resolve(0);
				}
				
            });
        }catch(error)
        {
           resolve(0);
        }
      
        });
   
    
}
exports.assign_fingerprint_to_bio_user=function(token,user_id,fingerprints)
{

 
        return new Promise((resolve) => {
            try {
		var finger_details=[];
       if(fingerprints.length>0){
		for(var i=0;i<fingerprints.length;i++)
		{
			
			var cards={	
				"is_prepare_for_duress": fingerprints[i]['is_prepare_for_duress'],
				"template0": fingerprints[i]['template0'],
				"template1": fingerprints[i]['template1']
			}
			finger_details.push(cards);
		}
              var obj={
				"fingerprint_template_list": finger_details
			  }
            axios({
                method: 'PUT', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/users/'+user_id+'/fingerprint_templates',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               data:obj,
            
                })
            .then(response=>{
			
                if(response.status==201)
                {
				
				resolve(1);
                 
				}
				
				else{
					resolve(0);
                }
        
    
            }).catch(error=>{
				console.log(error);
				if(error.response.status==401)
				{
					resolve(0);
				}
					else{
					resolve(0);
				}
				
			});
		}else{
			resolve(0);
		}
        }catch(error)
        {
           resolve(0);
        }
      
        });
   
    
}
exports.delete_user_from_biostar=function(token,user_id)
{
	console.log("DELETING BIOSTAR");
    var obj = [];
        return new Promise((resolve) => {
			obj={
				'user_id':user_id
			}
            try {    
            axios({
                method: 'DELETE', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/users/'+user_id,
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
           
            
                })
            .then(response=>{
			
                if(response.status==200)
                {
				
				resolve(true);
                 
				}
				
				else{
					resolve(false);
                }
        
    
            }).catch(error=>{
				resolve(false);
				
            });
        }catch(error)
        {
			resolve(false);
        }
      
        });
   
    
}
//=================================================
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
					console.log(error)
			
			});
		}catch(error)
		{
				console.log(error);
		}
	});
		

}
function formatDate(date){

	var t=1;
	var months=date.getMonth();
	var mon=Number(months)+Number(t);
	return ('{0}-{1}-{3}T{4}:{5}:{6}+08:00').replace('{0}', date.getFullYear()).replace('{1}', (date.getMonth() < 10 ? '0' : '')+mon).replace('{3}', (date.getDate() < 10 ? '0' : '')+date.getDate()).replace('{4}', (date.getHours() < 10 ? '0' : '')+date.getHours()).replace('{5}', (date.getMinutes() < 10 ? '0' : '')+date.getMinutes()).replace('{6}', (date.getSeconds() < 10 ? '0' : '')+date.getSeconds())
  }
