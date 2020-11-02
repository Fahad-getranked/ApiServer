const express= require("express");
const axios = require('axios');
const fs = require("fs");
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

exports. add_fr_user = function (personal_info,card_number)
{
   
    
  
	return new Promise((resolve) => {
		try {
            
            var imges=get_user_image( personal_info['photo']);
            imges.then(profileimage=>{
                var imagesy=profileimage.replace(/\s/g, '');
			 var devicestring="ApiKey="+process.env.FR_KEY+"&MethodType=POST&ApiSecret="+process.env.FR_SECRET_KEY+"&IP="+process.env.FR_LOCAL_IP+"&PortNumber="+process.env.FR_PORT+"&ProtocolType="+process.env.FR_PROTOCOL+"&ApiMethod=/api/visitor/v1/auth/reapplication&BodyParameters={}";	
  var url=process.env.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': process.env.FR_KEY,
'MethodType': 'POST',
'ApiSecret': process.env.FR_SECRET_KEY,
'IP': '127.0.0.1',
'PortNumber': process.env.FR_PORT,
'ProtocolType': process.env.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/single/add',
'BodyParameters': 
'{"personFamilyName":"'+personal_info['lastname']+'","personGivenName":"'+personal_info['firstname']+'","gender":1,"orgIndexCode":"7","phoneNo":"","faces": [{"faceData": "'+imagesy+'"}],"cards":[{"cardNo": "'+card_number+'"}]}' 
});

var config = {
  method: 'post',
  url: url,
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(function (response) {
	var myarray=[];
	myarray.push({"FR":{"person_id":response.data.data}});
 resolve(myarray);
 
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
    resolve(2);
});
})
.catch(function (error) {
  resolve(2);
});

            });
        }catch(error)
        {
            resolve(2);
        }
  
    });
}

exports. delete_fr_user = function (personal_id)
{
   
	return new Promise((resolve) => {
		try {
            
  var url=process.env.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': process.env.FR_KEY,
'MethodType': 'POST',
'ApiSecret': process.env.FR_SECRET_KEY,
'IP': '127.0.0.1',
'PortNumber': process.env.FR_PORT,
'ProtocolType': process.env.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/single/delete',
'BodyParameters': 
'{"personId":"'+personal_id+'"}' 
});

var config = {
  method: 'post',
  url: url,
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(function (response) {
  if(response.data.code==2)
{
  resolve(true);
}else{
 resolve(false);
}
})
.catch(function (error) {
  resolve(false);
});

        
        }catch(error)
        {
			resolve(false);
        }
  
    });
}


exports. delete_fr_card = function (personId)
{
	return new Promise((resolve) => {
		try {    
  var url=process.env.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': process.env.FR_KEY,
'MethodType': 'POST',
'ApiSecret': process.env.FR_SECRET_KEY,
'IP': '127.0.0.1',
'PortNumber': process.env.FR_PORT,
'ProtocolType': process.env.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/single/update',
'BodyParameters': 
'{"personId":"'+personId+'","orgIndexCode":"7","cards":[{"cardNo": "0"}]}' 
});

var config = {
  method: 'post',
  url: url,
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(function (response) {
resolve(true);
 
})
.catch(function (error) {
  resolve(error);
});

           
        }catch(error)
        {
            resolve(error);
        }
  
    });
}

exports. add_update_fr_card = function (personId,card_arry)
{
	return new Promise((resolve) => {
		try {    
  var url=process.env.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': process.env.FR_KEY,
'MethodType': 'POST',
'ApiSecret': process.env.FR_SECRET_KEY,
'IP': '127.0.0.1',
'PortNumber': process.env.FR_PORT,
'ProtocolType': process.env.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/single/update',
'BodyParameters': 
'{"personId":"'+personId+'","orgIndexCode":"7","cards":[{"cardNo": "'+card_arry["card_number"]+'"}],"beginTime": "'+card_arry["valid_from"]+'","endTime": "'+card_arry["valid_to"]+'"}' 
});

var config = {
  method: 'post',
  url: url,
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(function (response) {
  
resolve(true);

})
.catch(function (error) {
  resolve(false);
});

           
        }catch(error)
        {
            resolve(false);
        }
  
    });
}