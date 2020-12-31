const express= require("express");
const axios = require('axios');
const fs = require("fs");

var constants=require("../constants.js");
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
function formatDate(date){

  var t=1;
  var months=date.getMonth();
  var mon=Number(months)+Number(t);
  return ('{0}-{1}-{3}T{4}:{5}:{6}+08:00').replace('{0}', date.getFullYear()).replace('{1}', (date.getMonth() < 10 ? '0' : '')+mon).replace('{3}', (date.getDate() < 10 ? '0' : '')+date.getDate()).replace('{4}', (date.getHours() < 10 ? '0' : '')+date.getHours()).replace('{5}', (date.getMinutes() < 10 ? '0' : '')+date.getMinutes()).replace('{6}', (date.getSeconds() < 10 ? '0' : '')+date.getSeconds())
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
   
  
  var beginTimey=formatDate(new Date(card_number['valid_from']));
  var endTimey=formatDate(new Date(card_number['valid_to']));
  console.log(beginTimey +"   "+endTimey);
	return new Promise((resolve) => {
		try {
    
            var imges=get_user_image( personal_info['photo']);
            imges.then(profileimage=>{
                var imagesy=profileimage.replace(/\s/g, '');
			 var devicestring="ApiKey="+constants.FR_KEY+"&MethodType=POST&ApiSecret="+constants.FR_SECRET_KEY+"&IP="+constants.FR_LOCAL_IP+"&ProtocolType="+constants.FR_PROTOCOL+"&ApiMethod=/api/visitor/v1/auth/reapplication&BodyParameters={}";	
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': constants.FR_LOCAL_IP,
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/single/add',
'BodyParameters': 
'{"personFamilyName":"'+personal_info['lastname']+'","personGivenName":"'+personal_info['firstname']+'","gender":1,"orgIndexCode":"'+orgIndexCode+'","phoneNo":"'+personal_info['phone']+'","beginTime":"'+beginTimey+'","endTime":"'+endTimey+'","faces": [{"faceData": "'+imagesy+'"}],"cards":[{"cardNo": "'+card_number['card_number']+'"}]}' 
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
  try{
 axios({
    method: 'POST', 
    httpsAgent: extagent,
    url: url,
    data :devicestring,

    })
.then(function (restp){
if(restp.data.code==0)
{			
console.log('Added In Device');
}else{
  console.log('Added In Devices');
}
if(response.data.data!='')
   {
    var myarray=[];
    myarray.push({"FR":{"person_id":response.data.data,"message":"success"}});
   resolve(myarray);
   }else{
    var myarray=[];
    myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
   resolve(myarray);
   }
}).catch(error =>  {
  // console.log(error);
  var myarray=[];
	myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
 resolve(myarray);
});
}catch(error)
{
  var myarray=[];
  myarray.push({"FR":{"person_id":response.data.data,"message":"success"}});
}
})
.catch(function (error) {
  // console.log(error);
  var myarray=[];
	myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
 resolve(myarray);
});

            });
        }catch(error)
        {
          //  console.log(error);
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
      var devicestring="ApiKey="+constants.FR_KEY+"&MethodType=POST&ApiSecret="+constants.FR_SECRET_KEY+"&IP="+constants.FR_LOCAL_IP+"&ProtocolType="+constants.FR_PROTOCOL+"&ApiMethod=/api/visitor/v1/auth/reapplication&BodyParameters={}";	           
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
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


exports. add_update_fr_card = function (firstname,lastname,personId,card_arry)
{
 
 var beginTime=formatDate(new Date(card_arry['valid_from']));
  var endTime=formatDate(new Date(card_arry['valid_to']));
	return new Promise((resolve) => {
		try {
        var devicestring="ApiKey="+constants.FR_KEY+"&MethodType=POST&ApiSecret="+constants.FR_SECRET_KEY+"&IP="+constants.FR_LOCAL_IP+"&ProtocolType="+constants.FR_PROTOCOL+"&ApiMethod=/api/visitor/v1/auth/reapplication&BodyParameters={}";	     
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/single/update',
'BodyParameters': 
'{"personId":"'+personId+'","personFamilyName":"'+lastname+'","personGivenName":"'+firstname+'","cards":[{"cardNo": "'+card_arry["card_number"]+'"}],"beginTime": "'+beginTime+'","endTime": "'+endTime+'"}' 
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


