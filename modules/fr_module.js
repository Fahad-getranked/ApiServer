const express= require("express");
const axios = require('axios');
const fs = require("fs");
require ('custom-env').env('staging');
var qs = require('qs');
const https=require("https");
var apiKey;
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

exports. add_fr_user = function (personal_info,card_number,orgIndexCode)
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
'{"personFamilyName":"'+personal_info['lastname']+'","personGivenName":"'+personal_info['firstname']+'","gender":1,"orgIndexCode":"'+orgIndexCode+'","phoneNo":"","faces": [{"faceData": "'+imagesy+'"}],"cards":[{"cardNo": "'+card_number['card_number']+'"}],"beginTime": "'+new Date(card_number["valid_from"]).toISOString()+'","endTime": "'+new Date(card_number["valid_to"]).toISOString()+'"}' 
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
	myarray.push({"FR":{"person_id":response.data.data,"message":"success"}});
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
  var myarray=[];
	myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
 resolve(myarray);
});
})
.catch(function (error) {
  var myarray=[];
	myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
 resolve(myarray);
});

            });
        }catch(error)
        {
          var myarray=[];
          myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
         resolve(myarray);
        }
  
    });
}

exports. delete_fr_user = function (personal_id)
{
   
	return new Promise((resolve) => {
		try {
      var devicestring="ApiKey="+process.env.FR_KEY+"&MethodType=POST&ApiSecret="+process.env.FR_SECRET_KEY+"&IP="+process.env.FR_LOCAL_IP+"&PortNumber="+process.env.FR_PORT+"&ProtocolType="+process.env.FR_PROTOCOL+"&ApiMethod=/api/visitor/v1/auth/reapplication&BodyParameters={}";	           
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
  axios({
    method: 'POST', 
    httpsAgent: extagent,
    url: url,
    data :devicestring,

    })
.then(function (restp){

if(restp.data.code==0)
{	

  resolve(true);
}else{

}

}).catch(error =>  {
  resolve(false);
});
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

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

exports. delete_fr_card = function (personId)
{
  var munum=between(0, 5000);
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
'{"personId":"'+personId+'","orgIndexCode":"7","cards":[{"cardNo": "'+munum+'"}]}' 
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
 
  console.log(new Date(card_arry['valid_from']).toISOString()+"    "+new Date(card_arry['valid_to']).toISOString());
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
'{"personId":"'+personId+'","orgIndexCode":"7","cards":[{"cardNo": "'+card_arry["card_number"]+'"}],"beginTime": "'+new Date(card_arry['valid_from']).toISOString()+'","endTime": "'+new Date(card_arry['valid_to']).toISOString()+'"}' 
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


