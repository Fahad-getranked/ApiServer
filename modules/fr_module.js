const express= require("express");
const axios = require('axios');
const fs = require("fs");
var cron_mod = require('../modules/cron_module');
var fr_mod = require('../modules/fr_module');
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
        httpsAgent: extagent,
				url: url,
				headers: {}
			})
			.then(function (response){
				
				resolve(response.data);	
			}).catch(error =>  {
        resolve('');	
				//	console.log(error)
			
			});
		}catch(error)
		{
      resolve('');	
			//	console.log(error);
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
'{"personCode":"'+personal_info['person_code']+'","personFamilyName":"'+personal_info['lastname']+'","personGivenName":"'+personal_info['firstname']+'","gender":1,"orgIndexCode":"'+orgIndexCode+'","phoneNo":"'+personal_info['phone']+'","beginTime":"'+beginTimey+'","endTime":"'+endTimey+'","faces": [{"faceData": "'+imagesy+'"}],"cards":[{"cardNo": "'+card_number['card_number']+'"}]}' 
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

}else{
 
}

if(response.data.data!='')
   {
    cron_mod.save_logs_into_db('FR','ADD','User added successfully',1);
    var myarray=[];
  
      myarray.push({"FR":{"person_id":response.data.data,"vehicle_id":0,"message":"success"}});
      resolve(myarray);
  
   
   }else{
  
    var myarray=[];
    myarray.push({"FR":{"person_id":0,"vehicle_id":0,"message":"Invalid Request"}});
   resolve(myarray);
   }
}).catch(error =>  {
 
  cron_mod.save_logs_into_db('FR','ADD',error.response.data.message,0);
  var myarray=[];
	myarray.push({"FR":{"person_id":0,"vehicle_id":0,"message":"Invalid Request"}});
 resolve(myarray);
});
}catch(error)
{
  cron_mod.save_logs_into_db('FR','ADD',error.response.data.message,0);
  var myarray=[];
  myarray.push({"FR":{"person_id":0,"vehicle_id":0,"message":"success"}});
}
})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','ADD',error.response.data.message,0);
  var myarray=[];
	myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
 resolve(myarray);
});

            });
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','ADD',error.response.data.message,0);
          var myarray=[];
          myarray.push({"FR":{"person_id":0,"message":"Invalid Request"}});
         resolve(myarray);
        }
  
    });
}

exports. delete_fr_user = function (personal_id)
{
  console.log(personal_id);
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
  cron_mod.save_logs_into_db('FR','DELETE','User deleted successfully',1);
  resolve(true);
}else{

}

}).catch(error =>  {
  resolve(false);
});
  if(response.data.code==0)
{
  resolve(true);
}else{
 resolve(false);
}
})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','DELETE',error.response.data.message,0);
  resolve(false);
});

        
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','DELETE',error.response.data.message,0);
			resolve(false);
        }
  
    });
}


exports. add_update_fr_card = function (firstname,lastname,photo,personId,card_arry)
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
  fr_mod.update_fr_faceimage_for_single_user(photo,personId);
  cron_mod.save_logs_into_db('FR','UPDATE','User updated successfully',1);
  resolve(true);
}else{

}

}).catch(error =>  {
  cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
  resolve(false);
});


})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
  resolve(false);
});

     
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
            resolve(false);
        }
  
    });
}
exports. get_existing_users_by_name = function (person_name)
{
 
 
	return new Promise((resolve) => {
		try {
       
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/advance/personList',
'BodyParameters': 
'{ "personName": "'+person_name+'",    "pageNo": 1,     "pageSize":100 }' 
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
.then(function (response)
 {
 
  var array_cards=[];
   if(response.data.code==0)
   {
    
     if(response.data.data.total>0)
     {
       var person_list=response.data.data.list;
      
       person_list.forEach(function(element) {
       
      var cardno='N/A';
      if(element.cards)
      {
        cardno=element.cards[0].cardNo;
      }
        var persons={
          'personId':element.personId,
          'personCode':element.personCode,
          'org_id':element.orgIndexCode,
          'personName':element.personName,
          'phoneNo':element.phoneNo,
          'gender':element.gender,
          'email':element.email,
          'cardno':cardno,
          'photo':element.personPhoto.picUri,
          
        }
        var mydata=cron_mod.get_user_fr_picture(element.personPhoto.picUri,element.personId);
		mydata.then(respp=>{
      persons['image']=respp;
    })
       
      array_cards.push(persons);
    });
      var interval = setInterval(function() {
      
        resolve({"status":0,"message":"success","persons":array_cards}) 
clearInterval(interval);
					

			}, 900);
  
     }else{
      resolve({"status":1,"message":"failed","persons":{}})
     }
   

   }else{
     resolve({"status":1,"message":"failed","persons":{}})
   }
 

})
.catch(function (error) {
 console.log(error);
  resolve({"status":1,"message":"failed","persons":{}})
});

           
        }catch(error)
        {
         
          resolve({"status":1,"message":"failed","persons":{}})
        }
  
    });
}
exports. updat_user_face = function (image_url,personId,org_id,card_number)
{
   
  
	return new Promise((resolve) => {
		try {
    
            var imges=get_user_image(image_url);
            imges.then(profileimage=>{
                var imagesy=profileimage.replace(/\s/g, '');
		
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': constants.FR_LOCAL_IP,
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/face/single/update',
'BodyParameters': 
'{"personId":"'+personId+'","faceData":"'+imagesy+'"}' 
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
  cron_mod.save_logs_into_db('FR','UPDATE','user updated successfully',1);
  var respp=fr_mod.update_fr_user_details(personId,org_id,card_number);
  resolve(respp);
})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
  resolve(true);
});

            });
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
         resolve(true);
        }
  
    });
}
exports. update_fr_user_details = function (personId,org_id,card_number)
{
   
 console.log("Update User Info");
	return new Promise((resolve) => {
		try {
    
        
			// var devicestring="ApiKey="+constants.FR_KEY+"&MethodType=POST&ApiSecret="+constants.FR_SECRET_KEY+"&IP="+constants.FR_LOCAL_IP+"&ProtocolType="+constants.FR_PROTOCOL+"&ApiMethod=/api/visitor/v1/auth/reapplication&BodyParameters={}";	
  var url=constants.FR_HOST+'/api/FrData/';
  if(card_number!=0){
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': constants.FR_LOCAL_IP,
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/single/update',
'BodyParameters': 
'{"personId":"'+personId+'","orgIndexCode":"'+org_id+'","cards":[{"cardNo": "'+card_number+'"}]}' 
});
  }else{
    console.log(org_id+personId);
    var data = qs.stringify({
      'ApiKey': constants.FR_KEY,
     'MethodType': 'POST',
     'ApiSecret': constants.FR_SECRET_KEY,
     'IP': constants.FR_LOCAL_IP,
     'ProtocolType': constants.FR_PROTOCOL,
     'ApiMethod': '/api/resource/v1/person/single/update',
     'BodyParameters': 
     '{"personId":"'+personId+'","orgIndexCode":"'+org_id+'"}' 
     });
  }
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
 
if(response.data.code==0)
   {
    resolve(true);
   }else{
    // console.log(response);
    resolve(false);
   }


})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
  resolve(false);
});

            
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
          resolve(false);
        }
  
    });
}
exports. update_fr_faceimage_for_single_user = function (image_url,personId)
{
   
  
	return new Promise((resolve) => {
		try {
    
            var imges=get_user_image(image_url);
            imges.then(profileimage=>{
                var imagesy=profileimage.replace(/\s/g, '');
		
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': constants.FR_LOCAL_IP,
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/face/single/update',
'BodyParameters': 
'{"personId":"'+personId+'","faceData":"'+imagesy+'"}' 
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
 
  resolve(1);
})
.catch(function (error) {
 
  resolve(0);
});

            });
        }catch(error)
        {

         resolve(0);
        }
  
    });
}


///===================ADD FR VEHICLE INFO=============
exports. add_person_vehicle = function (person_id,plate_no,group)
{
 
 
	return new Promise((resolve) => {
		try {
       
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/vehicle/single/add',
'BodyParameters': 
'{ "plateNo": "'+plate_no+'",   "personId": "'+person_id+'", "vehicleGroupIndexCode": "'+group+'" }' 
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
.then(function (response)
 {
  
   if(response.data.code==0)
   {
    cron_mod.save_logs_into_db('FR','ADD','User vehicle successfully added',1);
     resolve({'vehicle_id':response.data.data.vehicleId,'plate_no':response.data.data.plateNo});
   }else{
     resolve(3);
   }

})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','ADD',error.response.data.message,0);
  resolve(3)
});

           
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','ADD',error.response.data.message,0);
          resolve(3)
        }
  
    });
}
exports. delete_person_vehicle = function (vehicle_id)
{
 
 
	return new Promise((resolve) => {
		try {
       
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/vehicle/single/delete',
'BodyParameters': 
'{ "vehicleId": "'+vehicle_id+'" }' 
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
.then(function (response)
 {
   if(response.data.code==0)
   {
    cron_mod.save_logs_into_db('FR','DELETE','User vehicle deleted successfully',1);
     resolve(1);
   }else{
     resolve(0);
   }

})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','DELETE',error.response.data.message,0);
 //console.log(error);
  resolve(0)
});

           
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','DELETE',error.response.data.message,0);
          resolve(0)
        }
  
    });
}
exports. update_person_vehicle = function (vehicle_id,person_id,plate_no,group)
{
 
 
	return new Promise((resolve) => {
		try {
       
  var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
 'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/vehicle/single/update',
'BodyParameters': 
'{"vehicleId": "'+vehicle_id+'", "plateNo": "'+plate_no+'",   "personId": "'+person_id+'", "vehicleGroupIndexCode": "'+group+'" }' 
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
.then(function (response)
 {
   if(response.data.code==0)
   {
    cron_mod.save_logs_into_db('FR','UPDATE','User vehicle successfully updated',1);
     resolve(1);
   }else{
     resolve(0);
   }

})
.catch(function (error) {
  cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
  resolve(0)
});

           
        }catch(error)
        {
          cron_mod.save_logs_into_db('FR','UPDATE',error.response.data.message,0);
          resolve(0)
        }
  
    });
}
//======================================================