const express= require("express");
const axios = require('axios');
var dateFormat = require('dateformat');
var constants=require("../constants.js");
var cron_mod = require('../modules/cron_module');
const lineReader = require('line-reader');
const fs=require("fs");
var qs = require('qs');
const https=require("https");
const shellExec = require('shell-exec');
var apiKey;
var extagent;
var extagent;
var url;
var access_group=0;
var card_type=0;
var objs=[];
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
var mysql = require('mysql');
var db_config = {
    host: 'localhost',
      user: 'root',
      password: '',
      database: 'imperium_app'
  };
  var con;

  function handleDisconnect() {
    con = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    con.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect()

const agent = new https.Agent({
    rejectUnauthorized: false
})
apiKey =constants.GALLAGHER_KEY;
extkey=apiKey;
extagent=agent


exports. save_logs_into_db= function (device_code,operation,message,status)
{
    con.query('SELECT id FROM `devices` where code="'+device_code+'"', function (error, results, fields) {
        if (error)
        {
       // , results[0].solution
       console.log(error);
        }else{
            var device_id=results[0].id;
            var sql = "INSERT INTO devices_logs (device_id,log_message,operation,status) VALUES ('"+device_id+"', '"+message+"', '"+operation+"', '"+status+"')";
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("----");
            });
        }
    });
}
exports. get_gallagher_divisions= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/items?type=15',
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
            var divisions=response.data.results;
            divisions.forEach(function(element) {
            var divs={
                'd_id':element.id,
                'name':element.name,
           };  
        obj.push(divs); 
    });
    resolve(obj);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_fr_organizations= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
         'ApiKey': constants.FR_KEY,
        'MethodType': 'POST',
        'ApiSecret': constants.FR_SECRET_KEY,
        'IP': '127.0.0.1',
        'ProtocolType': constants.FR_PROTOCOL,
        'ApiMethod': '/api/resource/v1/org/orgList',
        'BodyParameters': 
        '{"pageNo":1,"pageSize":500}' 
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
            if(response.data.data.list!='')
            {
            var orgs=response.data.data.list;
            orgs.forEach(function(element) {
            var divs={
                'd_id':element.orgIndexCode,
                'name':element.orgName,
           };  
        obj.push(divs); 
    });
    resolve(obj);
}else{

}
            }catch(error)
            {

            }
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports.get_bs_scan_devices=function(token)
{
    var obj = [];
        return new Promise((resolve) => {
            try {
              
            axios({
                method: 'GET', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/devices?limit=0&offset=1000',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               
            
                })
            .then(response=>{
                if(response.status==200)
                {
                    var divisions=response.data.records;
                    divisions.forEach(function(element) {
                        var device_ip=0;
                        if(element.lan)
                        {
                            if(element.lan.dhcp)
                            {
                                device_ip=element.lan.dhcp.device_ip;
                            }
                        }
                    var divs={
                        'id':element.id,
                        'name':element.name,
                        'status':element.status,
                        'device_ip':device_ip
                   };  
            //  console.log(divs);    
             obj.push(divs); 
                    })
                    resolve(obj);
                }else{

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
exports.get_bs_finger_events=function(token)
{
    var dbDate = new Date().toLocaleString();
    var seconds = constants.DEFAUL_EVENT_SECONDS;
    var parsedDate = new Date(Date.parse(dbDate))
    var newDate = new Date(parsedDate.getTime() - (1000 * 20))  
    newDate=newDate.toISOString();  
    var newDate2 = new Date(parsedDate.getTime())  
    newDate2=newDate2.toISOString(); 
    // console.log(newDate + "    "+newDate2);
    var obj = [];
        return new Promise((resolve) => {
            try {
                var data = {

                    "event_type_code": [
                        "4865"
                      ],
                      "datetime":[
    
                        newDate,newDate2
                      
                        ],
                      "limit": 10,
                      "offset": 1
                    }; 
            axios({
                method: 'POST', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/monitoring/event_log/search',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
                  data:data
            
                })
            .then(response=>{
               
                if(response.status==200)
                {
                    var events=response.data.records;
                    events.forEach(function(element) {
                        var date = new Date(element.datetime);
                        var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");        
                                    var divs={
                                    'id':element.id,
                                    'event_type':element.event_type.code,
                                    'event_name':element.event_type.name,
                                    'datetime':day,
                                    'user_id':element.user.user_id,
                                    'message':element.event_type.description
                                    }
                  
            //  console.log(divs);    
             obj.push(divs); 
                    })
                    resolve(obj);
                }else{

                }
        
    
            }).catch(error=>{
           //     console.log(error);
              resolve(false);
            });
        }catch(error)
        {
          //  console.log(error);
            resolve(false);
        }
      
        });
   
    
}
exports. save_bs_save_finger_print_data= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_bs_save_finger_print_data?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports.get_bs_user_groups=function(token)
{
    var obj = [];
        return new Promise((resolve) => {
            try {
              
            axios({
                method: 'GET', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/user_groups?limit=1000&offset=0',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               
            
                })
            .then(response=>{
                if(response.status==200)
                {
                    var divisions=response.data.records;
                    divisions.forEach(function(element) {
                      
                      
                    var divs={
                        'id':element.id,
                        'name':element.name
                   };  
            //  console.log(divs);    
             obj.push(divs); 
                    })
                    resolve(obj);
                }else{

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
exports.get_bs_access_groups=function(token)
{
    var obj = [];
        return new Promise((resolve) => {
            try {
              
            axios({
                method: 'GET', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/access_groups?limit=100&offset=0',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               
            
                })
            .then(response=>{
               
                if(response.status==200)
                {
                    var groups=response.data.records;
                    groups.forEach(function(element) {   
                    var divs={
                        'g_id':element.id,
                        'name':element.name
                   };  
                
             obj.push(divs); 
                    })
                    resolve(obj);
                }else{

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
exports.get_bs_access_levels=function(token)
{
    var obj = [];
        return new Promise((resolve) => {
            try {
              
            axios({
                method: 'GET', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/access_levels?limit=1000&offset=0',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               
            
                })
            .then(response=>{
                if(response.status==200)
                {
                    var groups=response.data.records;
                    groups.forEach(function(element) {   
                    var divs={
                        'g_id':element.id,
                        'name':element.name
                   };  
            //  console.log(divs);    
             obj.push(divs); 
                    })
                    resolve(obj);
                }else{

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
exports.get_bs_access_doors=function(token)
{
    var obj = [];
        return new Promise((resolve) => {
            try {
              
            axios({
                method: 'GET', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/doors?limit=1000&offset=0',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
               
            
                })
            .then(response=>{
                if(response.status==200)
                {
                    var groups=response.data.records;
                    groups.forEach(function(element) {   
                    var divs={
                        'd_id':element.id,
                        'name':element.name
                   };  
            //  console.log(divs);    
             obj.push(divs); 
                    })
                    resolve(obj);
                }else{

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
exports.Login_into_device=function()
{
    return new Promise((resolve) => {
        try {
            var obj={
                'name':constants.BIO_STAR_NAME,
                'password':constants.BIO_STAR_PASSWORD,
                'user_id':constants.BIO_STAR_USERNAME
            }
        axios({
            method: 'POST', 
            httpsAgent: extagent,
            url: constants.BIO_STAR_URL+'/login',
            headers: { 
                'Content-Type': 'application/json'
              },
            data :obj,
        
            })
        .then(response=>{
         if (response.status == 200) 
            {
            
                resolve(response.headers['set-token']);
                
            }else{
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
exports. get_fr_groups= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
         'ApiKey': constants.FR_KEY,
        'MethodType': 'POST',
        'ApiSecret': constants.FR_SECRET_KEY,
        'IP': '127.0.0.1',
        'ProtocolType': constants.FR_PROTOCOL,
        'ApiMethod': '/api/frs/v1/face/groupList',
        'BodyParameters': 
        '{"pageNo":1,"pageSize":500}' 
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
            if(response.data.data.list!='')
            {
            var orgs=response.data.data.list;
          
            orgs.forEach(function(element) {
            var groups={
                'g_id':element.indexCode,
                'name':element.name,
                'type':0
           };  
        obj.push(groups); 
    });
    resolve(obj);
}else{

}
            }catch(error)
            {

            }
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_fr_vehicle_groups= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
         'ApiKey': constants.FR_KEY,
        'MethodType': 'POST',
        'ApiSecret': constants.FR_SECRET_KEY,
        'IP': '127.0.0.1',
        'ProtocolType': constants.FR_PROTOCOL,
        'ApiMethod': '/api/resource/v1/vehicleGroup/vehicleGroupList',
        'BodyParameters': 
        '{"pageNo":1,"pageSize":500}' 
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
            if(response.data.data.list!='')
            {
            var orgs=response.data.data.list;
          
            orgs.forEach(function(element) {
               if(element.vehicleGroupName!="")
               {
                   var vname=element.vehicleGroupName;
               
            var groups={
                'g_id':element.vehicleGroupIndexCode,
                'name':vname,
                'type':3
           }; 
        } 
        obj.push(groups); 
    });
    resolve(obj);
}else{

}
            }catch(error)
            {

            }
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_fr_doors= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
         'ApiKey': constants.FR_KEY,
        'MethodType': 'POST',
        'ApiSecret': constants.FR_SECRET_KEY,
        'IP': '127.0.0.1',
        'ProtocolType': constants.FR_PROTOCOL,
        'ApiMethod': '/api/resource/v1/acsDoor/acsDoorList',
        'BodyParameters': 
        '{"pageNo":1,"pageSize":500}' 
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
            if(response.data.data.list!='')
            {
            var orgs=response.data.data.list;
          
            orgs.forEach(function(element) {
            var groups={
                'd_id':element.doorIndexCode,
                'name':element.doorName,
                'type':0
           };  
        obj.push(groups); 
    });
    resolve(obj);
}else{

}
            }catch(error)
            {

            }
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_gallagher_access_groups= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/access_groups?top=1000',
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
            var accessgroups=response.data.results;
    accessgroups.forEach(function(element) {
    
       	
        if(element.parent!=undefined && element.parent!='' ){
        var lastURLSegment = element.parent.href.substr(element.parent.href.lastIndexOf('/') + 1);		
        var access_groups={
             'g_id':element.id,
             'parent_group_id':lastURLSegment,
             'name':element.name,

        }; 
        }else{
        
            var access_groups={
                'g_id':element.id,
                'parent_group_id':0,
                'name':element.name,
   
           };
             
        
        }
        obj.push(access_groups);
    
    
    });
    resolve(obj);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_gallagher_zones= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/access_zones?top=1000',
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
            var zones=response.data.results;
            zones.forEach(function(element) {
    
      
        var access_zones={
             'z_id':element.id,
             'name':element.name,

        }; 
       
        obj.push(access_zones);
    
    
    });
    resolve(obj);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_gallagher_card_types= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/card_types?top=1000',
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
            var cardtypes=response.data.results;
            cardtypes.forEach(function(element) {
    
      
        var access_card_types={
             'c_id':element.id,
             'name':element.name,
             'type':element.credentialClass,
             'minimumNumber':element.minimumNumber,
             'maximumNumber':element.maximumNumber,

        }; 
       
        obj.push(access_card_types);
    
    
    });
    resolve(obj);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_gallagher_doors= function ()
{
    
    
	return new Promise((resolve) => {
      
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/doors?top=1000',
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
            var doors=response.data.results;
            doors.forEach(function(element) {
    var vals=get_gallagher_door_info(element.id);
  
     vals.then(res=>{
   
        objs.push(res);
        //console.log(objs);
    
      });
   
    //  console.log(myarray); 
     
    
    
    });
    var intervalxxx = setInterval(function() {

    resolve(objs);
    clearInterval(intervalxxx);
}, 100);

             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_gallagher_door_alarms=function()
{
   
    var dbDate = new Date().toLocaleString();
    var seconds = constants.DEFAUL_EVENT_SECONDS;
    var parsedDate = new Date(Date.parse(dbDate))
    var newDate = new Date(parsedDate.getTime() - (1000 * seconds))  
    newDate=newDate.toISOString();
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/events?after='+newDate,
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
           
            var events=response.data.events;
            
    events.forEach(function(element) {
        
        if(element.type.id==23035 || element.type.id==3300 || element.type.id==23032  || element.type.id==20013  || element.type.id==3063  || element.type.id==30001 || element.type.id==15730 || element.type.id==23029 || element.type.id==20018 || element.type.id==23051 || element.type.id==22003 || element.type.id==21061 || element.type.id==23108 || element.type.id==15013 || element.type.id==506 || element.type.id==507 || element.type.id==15273)
        {
           
                        if(element.source.id)
                        {
                        var source_id=element.source.id;
                        var source_name=element.source.nme;
                        }else{
                        var source_id=0;
                        var source_name="";
                        }
                        if(element.source.id)
                        {
                        var source_id=element.source.id;
                        var source_name=element.source.nme;
                        }else{
                        var source_id=0;
                        var source_name="";
                        } 
                        if(element.alarm)
                        {
                        var type=0;                 
                        }else
                        {
                        var type=1;
                        } 

                var date = new Date(element.time);
                var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");
            var checkin_events={
                'event_id':element.id,
                'event_type':element.type.id,
                'type':type,
                'event_name':element.type.name,
                'priority':element.priority,
                'source_id':source_id,
                'source_name':source_name,  
                'datetime':day,
                'message':element.message,
           };
        obj.push(checkin_events);
    
        }
    
    });
    var intervalxxx = setInterval(function() {

        resolve(obj);
        clearInterval(intervalxxx);
    }, 50);
  
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
//================
exports. get_biostar_events_alarms=function(token)
{
    var dbDate = new Date().toLocaleString();
    var seconds = constants.DEFAUL_EVENT_SECONDS;
    var parsedDate = new Date(Date.parse(dbDate))
    var newDate = new Date(parsedDate.getTime() - (1000 * 20))  
    newDate=newDate.toISOString();  
    var newDate2 = new Date(parsedDate.getTime())  
    newDate2=newDate2.toISOString(); 
    // console.log(newDate + "    "+newDate2);
    var obj = [];
        return new Promise((resolve) => {
            try {
                var data = {

                
                    "datetime":[
    
                        newDate,newDate2
                      
                        ],
                      "limit": 10,
                      "offset": 1
                    }; 
            axios({
                method: 'POST', 
                httpsAgent: extagent,
                url: constants.BIO_STAR_URL+'/monitoring/event_log/search',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie':'bs-cloud-session-id='+token
                  },
                  data:data
            
                })
            .then(response=>{
               
                if(response.status==200)
                {
                    var events=response.data.records;
                    events.forEach(function(element) {
                        var date = new Date(element.datetime);
                        var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");   
                        var src_index=0;     
                                  if(element.type=='DEVICE')
                                  {
                                      if(element.device.id){ src_index=element.device.id;}else{src_index=0;}
                                   
                                  }else  if(element.type=='DOOR')
                                  {
                                      if(element.device.id){ src_index=element.door.id;}else{src_index=0;}
                                   
                                  }
                                  else  if(element.type=='DOOR')
                                  {
                                      if(element.device.id){ src_index=element.door.id;}else{src_index=0;}
                                   
                                  }
                                  if(element.type!='AUTHENTICATION')
                                  {
                                    var divs={
                                        'event_id':element.id,
                                        'event_type':element.event_type.code,
                                        'event_name':element.event_type.name,
                                        'priority':1,
                                        'source_id':src_index,
                                        'source_name':element.type,  
                                        'datetime':day,
                                        'message':element.event_type.description,
                                   };
            //  console.log(divs);    
             obj.push(divs); 
                                }
                    })
                    resolve(obj);
                }else{

                }
        
    
            }).catch(error=>{
               // console.log(error);
              resolve(false);
            });
        }catch(error)
        {
           // console.log(error);
            resolve(false);
        }
      
        });
   
}

//================
exports. check_gallagher_delete_cardholder_events=function()
{
    try{
    var dbDate = new Date().toLocaleString();
    var seconds = constants.DEFAULT_DELETE_EVENT_SECONDS;
    var parsedDate = new Date(Date.parse(dbDate))
    var newDate = new Date(parsedDate.getTime() - (1000 * seconds))  
    newDate=newDate.toISOString();
   
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/events?type=15004&after='+newDate,
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
            try{
            var events=response.data.events;
           
    events.forEach(function(element) {
	
            var checkin_events={
                'cardholder_id':element.cardholder.id,
           };
        obj.push(checkin_events);
     
    
    });
    resolve(obj);
}catch(error){

}
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}catch(error)
{

}
}
exports. get_gallagher_all_events=function()
{

   
	return new Promise((resolve) => {
       
        lineReader.eachLine('././events.txt', function(line) {
          
            var obj = [];
            var transactions_time;
       
            if (line.includes('STOP')) {
            
                var dbDate = new Date().toLocaleString();
                var seconds = constants.DEFAUL_EVENT_SECONDS;
                var parsedDate = new Date(Date.parse(dbDate))
                var newDate = new Date(parsedDate.getTime() - (1000 * seconds))  
                newDate=newDate.toISOString();
                transactions_time=newDate;
               //console.log(transactions_time);
            }else{
                transactions_time=line;
               // console.log(transactions_time);
            }
           
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/events?bottom=5000&type=20001&after='+transactions_time,
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
            var events=response.data.events;
    events.forEach(function(element) {
				if(element.card)
				{
					var cardnumber=element.card.number;
				}else{
                    var cardnumber=0;
                }
                transactions_time=element.time;
            var date = new Date(element.time);
            var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");      
            var checkin_events={
                'external_id':element.id,
                'event_name':element.type.name,
                'eventID':element.type.id,
                'event_priority':element.priority,
                'cardholder_id':element.cardholder.id,
                'zone_id':element.entryAccessZone.id,
                'door_id':element.source.id,
                'type':1,
                'datetime':day,
                'cardnumber':cardnumber,
                'message':element.message

   
           };
        obj.push(checkin_events);
    
    
    });
    axios({
        method: 'get',
        httpsAgent: extagent,
        url:  constants.GALLAGHER_HOST + '/api/events?bottom=5000&type=20003&after='+transactions_time,
        headers: {
            'Authorization': apiKey,
            'Content-Type' : 'application/json'
          }
      })
    .then(function (response) {
     
        var events=response.data.events;
events.forEach(function(element) {
            if(element.card)
            {
                var cardnumber=element.card.number;
            }else{
                var cardnumber=0;
            }
            transactions_time=element.time;
            var date = new Date(element.time);
            var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");
        var checkin_events={
            'external_id':element.id,
            'cardholder_id':element.cardholder.id,
            'event_name':element.type.name,
            'eventID':element.type.id,
            'event_priority':element.priority,
            'zone_id':element.exitAccessZone.id,
            'door_id':element.source.id,
            'type':0,
            'datetime':day,
            'cardnumber':cardnumber,
            'message':element.message


       };
    obj.push(checkin_events);
   

});

}).catch(error =>  {
    //	console.log(error)
    
    });
    //=======================
    axios({
        method: 'get',
        httpsAgent: extagent,
        url:  constants.GALLAGHER_HOST + '/api/events?bottom=5000&type=20039&after='+transactions_time,
        headers: {
            'Authorization': apiKey,
            'Content-Type' : 'application/json'
          }
      })
    .then(function (response) {
  
        var events=response.data.events;
events.forEach(function(element) {
            if(element.card)
            {
                var cardnumber=element.card.number;
            }else{
                var cardnumber=0;
            }
            transactions_time=element.time;
        var date = new Date(element.time);
        var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");      
        var noentry_events={
            'external_id':element.id,
            'cardholder_id':element.cardholder.id,
            'event_name':element.type.name,
            'eventID':element.type.id,
            'event_priority':element.priority,
            'zone_id':element.entryAccessZone.id,
            'door_id':element.source.id,
            'type':1,
            'datetime':day,
            'eventType':2,
            'cardnumber':cardnumber,
            'message':element.message


       };
    obj.push(noentry_events);


});
        
}).catch(error =>  {
    //	console.log(error)
    
    });

    fs.writeFile('././events.txt', transactions_time, function (err) {
        if (err) 
         console.log(err);
      
      });
     // console.log("TIME="+transactions_time);
     var intervalxxx = setInterval(function() {

        resolve(obj);
         clearInterval(intervalxxx);
     }, 500);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });

})
}



//==============NEW LOGIC OF ALL EVENTS===============




//===================================================
exports. save_gg_access_groups_in_server= function (access_groups,tag)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_groups_in_gallagher?code='+constants.CODE+'&tag='+tag,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :access_groups
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_gg_divisions_in_server= function (divisions,tag)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_divisions_in_gallagher?code='+constants.CODE+'&tag='+tag,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :divisions
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_fr_org_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_organization_in_fr?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_bs_scan_devices_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_scan_devices_in_biostar?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        if(error.response.status==401)
        {
            resolve(2);
        }else{
            resolve(3);
        }
        
        });
  
    });
}
exports. save_bs_user_groups_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_user_groups_in_biostar?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        if(error.response.status==401)
        {
            resolve(2);
        }else{
            resolve(3);
        }
        
        });
  
    });
}
exports. save_bs_access_groups_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_access_groups_in_biostar?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        if(error.response.status==401)
        {
            resolve(2);
        }else{
            resolve(3);
        }
        
        });
  
    });
}
exports. save_bs_access_levels_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_access_levels_in_biostar?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        if(error.response.status==401)
        {
            resolve(2);
        }else{
            resolve(3);
        }
        
        });
  
    });
}
exports. save_bs_access_doors_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_doors_in_biostar?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        if(error.response.status==401)
        {
            resolve(2);
        }else{
            resolve(3);
        }
        
        });
  
    });
}
exports. save_fr_group_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_groups_in_fr?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_fr_vehicle_group_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_vehicle_access_groups_in_fr?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_fr_doors_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_doors_in_fr?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_gg_access_zones_in_server= function (access_zones,tag)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_zones_in_gallagher?code='+constants.CODE+'&tag='+tag,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :access_zones
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_gg_doors_in_server= function (doors,tag)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_doors_in_gallagher?code='+constants.CODE+'&tag='+tag,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :doors
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. save_gg_card_types_in_server= function (card_types,tag)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_card_types_in_gallagher?code='+constants.CODE+'&tag='+tag,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :card_types
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. check_gg_user_data_deleted_from_server= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/check_gg_user_data_exist_on_live_server?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. save_gg_checkin_checkout_events_in_server= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_checkin_checkout_events_in_gallagher?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. save_gg_noentry_events_in_server= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_noentry_events_in_gallagher?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. save_gg_ndoor_alarms_events_in_server= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_alarm_events_in_gallagher?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. save_bs_ndoor_alarms_events_in_server= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_alarm_events_in_biostar?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. save_fr_transactions= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/fr_transactions?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. save_fr_motion_detection_events= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/fr_motion_detection_events?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. save_fr_images= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_fr_images',
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}

//======================READ DATA FROM GALLAGHER================================
exports. check_gallagher_add_cardholder_events=function()
{
   
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/cardholders',
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
           try{
            var events=response.data.results;
           if(response.data.results!=''){
              
    events.forEach(function(element) {  
     
        
            
            var records=cron_mod.get_cardholders_details_from_events(element.id);
            records.then(rest=>{
              //  console.log(rest);
                obj.push(rest);     
            
             
            });
      
      
      
        
    });
   
    
    var intervalxxx = setInterval(function() {

        resolve(obj);
        clearInterval(intervalxxx);
    }, 10000);
   
}
           }catch(error)
           {

           }
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports.get_cardholders_details_from_events = function(card_holder_id)
{
  
    return new Promise((resolve) => { 
        try{
        axios({
         method: 'get',
         httpsAgent: extagent,
         url:  constants.GALLAGHER_HOST + '/api/cardholders/'+card_holder_id,
         headers: {
             'Authorization': apiKey,
             'Content-Type' : 'application/json'
           }
       })
     .then(function (cardholderlist) {
      
         if(cardholderlist.status==200)//check data available
         {
            
            
          if(cardholderlist.data!=""){
              var email="";
              var phone="";
              
              if(cardholderlist.data.personalDataDefinitions){
           
                var personal_info=[];
                for(var t=0;t<cardholderlist.data.personalDataDefinitions.length;t++)
                 {
                         if(cardholderlist.data.personalDataDefinitions[t]["@Email"])
                         {
                            email= cardholderlist.data.personalDataDefinitions[t]["@Email"]["value"];
                         }
                         if(cardholderlist.data.personalDataDefinitions[t]["@Phone"])
                         {
                            phone= cardholderlist.data.personalDataDefinitions[t]["@Phone"]["value"];
                         }
                 }
                }//Shifted here
       //   if(email!=""){
        var divisons=cardholderlist.data.division.href;
        var division_id=divisons.match(/([^\/]*)\/*$/)[1];
            var personal_info={
                 'personID':card_holder_id,    
                 'firstname':cardholderlist.data.firstName,
                 'lastname':cardholderlist.data.lastName,
                 'division':division_id,
                 'phone':phone,
                 'email':email   
                             }
               
                             var groups=[];
                             var array_cards=[];
                if(cardholderlist.data.accessGroups){
                 for(var k=0;k<cardholderlist.data.accessGroups.length;k++)
                 {
                     var grp=cardholderlist.data.accessGroups[k].accessGroup.href;
                     var group_id=grp.match(/([^\/]*)\/*$/)[1];
                 
                 groups.push(group_id);
                 }
                }
                
                if(cardholderlist.data.cards){
                   
                 for(var i=0;i<cardholderlist.data.cards.length;i++)
                 {
                     try{
                     var p=cardholderlist.data.cards[i].href;
                     card_id=p.match(/([^\/]*)\/*$/)[1];	
                     var sy=cardholderlist.data.cards[i].type.href;
                     var card_type=sy.match(/([^\/]*)\/*$/)[1];
                     var status=cardholderlist.data.cards[i].status.value;
                     if(cardholderlist.data.cards[i].from){
                     var vfrom = new Date(cardholderlist.data.cards[i].from);
                     var valid_from=dateFormat(vfrom.toString(), "yyyy-mm-dd HH:MM:ss");  
                     var vto = new Date(cardholderlist.data.cards[i].until);
                     var valid_to=dateFormat(vto.toString(), "yyyy-mm-dd HH:MM:ss");
                     }else{
                        var valid_from="";
                        var valid_to="";
                     }
                     if(cardholderlist.data.cards[i].credentialClass!="mobile" && status=='Active')
                     {
                         
                         var cards={
                             'card_id':card_id,
                             'card_type':card_type,
                             'invitation_code':0,
                             'status':status,
                             'valid_from':valid_from,
                             'valid_to':valid_to,
                             'card_number':cardholderlist.data.cards[i].number
                          }
                          array_cards.push(cards);
                     }else if(cardholderlist.data.cards[i].credentialClass=="mobile" && status=='Active'){
                        try{
                        var cx=cardholderlist.data.cards[i].invitation.href;
                         var code=cx.match(/([^\/]*)\/*$/)[1];
                          
                         var cards={
                             'card_id':card_id,
                             'card_type':card_type,
                             'invitation_code':code,
                             'status':status,
                             'valid_from':valid_from,
                             'valid_to':valid_to,
                             'card_number':0
                          }
                          array_cards.push(cards);
                        }catch(error)
                        {
                            
                        }
                       
                     }
                    }catch(error)
                    {

                    }   
                 }
                }
                
             if(array_cards!='' && groups!=""){
                var mydata={
                    "personal":personal_info,
                    "groups":groups,
                    "cards":array_cards
                 }
              
            resolve(mydata); 
                }else{
                    resolve(false);
                } 
                // }else{
                  
                //     resolve(false); //if email and phone exisits
                // }
                        // }else{
                          
                        //     // resolve(''); //Personal Fields
                        // }
             }else{
                
                // resolve('');//if cardholder info exists
                resolve(false);
             }
            

                                    }else{
                                        // resolve('');//if api call is valid
                                        resolve(false);
                                    }



     }).catch(error =>  {
      // console.log(error);
      resolve(false);
     });
    }catch(error)
    {
        resolve(false);
    }
 }).catch(error =>  {
   // console.log(error);
   resolve(false);
 });
}
exports. save_gg_cardholders_on_server= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_add_cardholder_events?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       
       resolve(response.data);
             }).catch(error =>  {
        	console.log(error)
        
        });
  
    });
}
//==================READ DATA FROM FR================
exports. check_fr_add_users_events=function()
{
    var obj = [];
   return new Promise((resolve) => {
       try {
     
 var url=constants.FR_HOST+'/api/FrData/';
var data = qs.stringify({
'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/resource/v1/person/personList',
'BodyParameters': '{"pageNo": 1,"pageSize": 500 }' 
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
    if(response.status==200 && response.data.data!='')
    {

var variab=response.data.data.list;
if(variab.length>0){
variab.forEach(function(element) {           
 
    var begintime = new Date(element.beginTime);
    var valid_from=dateFormat(begintime.toString(), "yyyy-mm-dd HH:MM:ss"); 
    var endtime = new Date(element.endTime);
    var valid_to=dateFormat(endtime.toString(), "yyyy-mm-dd HH:MM:ss"); 
        if(element.cards)
        {
            var cardno=element.cards[0].cardNo;    
        }else{
            var cardno=0;
        }
        if(cardno!=0){
        var rest={
            'personid':element.personId,
            'full_name':element.personName,
            'email':element.email,
            'phone':element.phoneNo,
            'org':element.orgIndexCode,
            'valid_from':valid_from,
            'valid_to':valid_to,
            'card_number':cardno
        }
        obj.push(rest);
    }else{

    }     
   
});
resolve(obj);
}else{
    resolve(false);
}


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
exports. save_fr_users_on_server= function (user_data)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_add_users_events?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :user_data
          })
        .then(function (response) {
       resolve(response.data);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. check_fr_get_event_subscription=function()
{
   
    var obj = [];
   return new Promise((resolve) => {
       try {
        
 var url=constants.FR_EVENT_URL+'/api/FrData/';
var data = qs.stringify({
'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/eventService/v1/eventSubscriptionView',
'BodyParameters': '{}' 
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
  
    if(response.status==200)
    {
      
       if(response.data.code==0 && response.data.data!=''){
           console.log(response.data.data.detail.length);
        if(response.data.data.detail.length==3)
        {    
            resolve(true);
        }else{
            resolve(-1);
        }
    }else{
        resolve(-1);
    }

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
exports. save_fr_get_event_subscription=function(subscript)
{
    
    var obj = [];
   return new Promise((resolve) => {
       try {
        
 var url=constants.FR_EVENT_URL+'/api/FrData/';
var data = qs.stringify({
'ApiKey': constants.FR_KEY,
'MethodType': 'POST',
'ApiSecret': constants.FR_SECRET_KEY,
'IP': '127.0.0.1',
'ProtocolType': constants.FR_PROTOCOL,
'ApiMethod': '/api/eventService/v1/eventSubscriptionByEventTypes',
'BodyParameters': subscript
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
   if(response.data){
    if(response.data.code==0 )
    {     
        
       resolve(true);
    }else{
        resolve(false);
    }
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
exports. download_fr_image= function (image)
{

   // console.log(image);
    return new Promise((resolve) => {
    try{
        console.log("edewdwed");
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
         'ApiKey': constants.FR_KEY,
        'MethodType': 'POST',
        'ApiSecret': constants.FR_SECRET_KEY,
        'IP': constants.FR_LOCAL_IP,
        'ProtocolType': constants.FR_PROTOCOL,
        'ApiMethod': '/api/frs/v1/application/picture',
        'BodyParameters': 
        '{"url":"'+image+'"}' 
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
      resolve(response.data);
        }).catch(error =>  {
            resolve(error);
    
        });
    }catch(error)
    {
        resolve(error);
    }
});
}
exports. get_user_fr_picture= function (image,personId)
{

   // console.log(image);
    return new Promise((resolve) => {
    try{
       
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
         'ApiKey': constants.FR_KEY,
        'MethodType': 'POST',
        'ApiSecret': constants.FR_SECRET_KEY,
        'IP': constants.FR_LOCAL_IP,
        'ProtocolType': constants.FR_PROTOCOL,
        'ApiMethod': '/api/resource/v1/person/picture_data',
        'BodyParameters': 
        '{"picUri":"'+image+'","personId":"'+personId+'"}' 
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
            if(response.data.code)
            {
                resolve('');
            }else{
                resolve(response.data);
            }
      
        }).catch(error =>  {
            resolve('');
    
        });
    }catch(error)
    {
        resolve('');
    }
});
}
//===========================================
exports. get_cameras_listing_from_hikcentral = function ()
{

   // console.log(image);
    return new Promise((resolve) => {
    try{
       
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
            'ApiKey': constants.FR_KEY,
            'MethodType': 'POST',
            'ApiSecret': constants.FR_SECRET_KEY,
            'IP': constants.FR_LOCAL_IP,
            'ProtocolType': 'https',
            'ApiMethod': '/api/resource/v1/camera/advance/cameraList',
            'BodyParameters': '{   "pageNo": 1,   "pageSize": 200,   "siteIndexCode": "0" }' 
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
            if(response.data.code !== 'undefined')
            {    if(response.data.msg === 'Success')
                {   
                    resolve(response.data.data.list);
                } else {
                    resolve(''); 
                }
            }else{
                resolve('');
            }
      
        }).catch(error =>  {
            resolve('');
    
        });
    }catch(error)
    {
        
        resolve('');
    }
});
}

exports. save_cameras_in_server= function (orgs)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_cameras?code='+constants.CODE,
            headers: {
                'Content-Type' : 'application/json'
              },
              data :orgs
          })
        .then(function (response) {

            console.log
            resolve(response.data);
        }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}
exports. get_cameras_thumbnail= function (cameraIndexCode)
{
    var obj = []; 
	return new Promise((resolve) => {
        
        var url=constants.FR_HOST+'/api/FrData/';
        var data = qs.stringify({
            'ApiKey': constants.FR_KEY,
            'MethodType': 'POST',
            'ApiSecret': constants.FR_SECRET_KEY,
            'IP': constants.FR_LOCAL_IP,
            'ProtocolType': 'https',
            'ApiMethod': '/api/video/v1/cameras/previewURLs',
            'BodyParameters': '{\n   "cameraIndexCode": "'+cameraIndexCode+'",\n    "streamType": "0",\n    "protocol": "rtsp_s",\n    "transmode": "1"\n}' 
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
            
            var streamurl = response.data.data.url;
            var command  = 'ffmpeg -y -i '+streamurl+' -vframes 1 ././'+cameraIndexCode+'.jpg';
            shellExec(command).then(function(){

                var file = cameraIndexCode+'.jpg';
                var bitmap = fs.readFileSync(file);
                // convert binary data to base64 encoded string
                var base64_image =  new Buffer.from(bitmap).toString('base64');
                
                resolve(base64_image);
            }).catch(function(){
                resolve('');
            });
            
            
        }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
}

//===========================================







function get_gallagher_door_info(id)
{
    
    return new Promise((resolve) => {
        var doorsarray;
    axios({
        method: 'get',
        httpsAgent: extagent,
        url:  constants.GALLAGHER_HOST + '/api/doors/'+id,
        headers: {
            'Authorization': apiKey,
            'Content-Type' : 'application/json'
          }
      })
    .then(function (responsey) {
        if(responsey.data.entryAccessZone){
        var s=responsey.data.entryAccessZone.href;
        var zone_id=s.match(/([^\/]*)\/*$/)[1];
doorsarray={
 'd_id':responsey.data.id,
 'name':responsey.data.name,
 'zone_id':zone_id
}; 

resolve(doorsarray);
    }else{
      //  console.log("No Zone define");
        resolve('');
    }
    });
}).catch(error=>{
   // console.log("Wweqwe");
})


}
//=====================CHECKING DEVICES STATUSES===============
exports. check_gallagher_device_status= function ()
{
     
    return new Promise((resolve) => {
     try{ 
    axios({
        method: 'get',
        httpsAgent: extagent,
        url:  constants.GALLAGHER_HOST + '/api/',
        headers: {
            'Authorization': apiKey,
            'Content-Type' : 'application/json'
          }
      })
    .then(function (response) {
        if(response.status==200){
        resolve(1);
        }else{
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

exports. check_fr_device_status= function ()
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
'ApiMethod': '/api/',
'BodyParameters': 
'{}' 
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
 if(response.status==200)
 {
    resolve(1);
 }else{
     resolve(0);
 }
  

})
.catch(function (error) {
    resolve(0)
});

           
        }catch(error)
        {
         
          resolve(0)
        }
  
    });
}
exports. check_biostar_device_status= function ()
{
    return new Promise((resolve) => {
        try {
            var obj={
                'name':constants.BIO_STAR_NAME,
                'password':constants.BIO_STAR_PASSWORD,
                'user_id':constants.BIO_STAR_USERNAME
            }
        axios({
            method: 'POST', 
            httpsAgent: extagent,
            url: constants.BIO_STAR_URL+'/login',
            headers: { 
                'Content-Type': 'application/json'
              },
            data :obj,
        
            })
        .then(response=>{
         if (response.status == 200) 
            {
            
                resolve(1);
                
            }else{
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
exports. save_device_statuses= function (status,device_code)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_device_statuses?code='+constants.CODE+"&status="+status+"&device_code="+device_code,
            headers: {
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {
resolve(true);
        }).catch(error =>  {
            resolve(false);
        });
  
    });
}
exports. update_device_statuses_into_db= function (status,device_code)
{
            var sql = "UPDATE devices SET status="+status+" WHERE code='"+device_code+"'";
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("----");
            });
        
    
}
//====================GET EVENTS OF CRON To CHECK UPDATE<ADD<DELETE=======
exports. check_event_trigger_or_not= function ()
{
var dbDate = new Date().toLocaleString();
var seconds = constants.DEFAUL_EVENT_SECONDS;
var parsedDate = new Date(Date.parse(dbDate))
var newDate = new Date(parsedDate.getTime() - (1000 * seconds))  
newDate=newDate.toISOString();
transactions_time=newDate; 
return new Promise((resolve) => {
    try{
  //=================ADD GROUPSSSS===========
    axios({
        method: 'get',
        httpsAgent: extagent,
        url:  constants.GALLAGHER_HOST + '/api/events?bottom=5000&type=15003&after='+transactions_time,
        headers: {
            'Authorization': apiKey,
            'Content-Type' : 'application/json'
          }
      })
    .then(function (response) {  
    var events=response.data.events;
   if(events!=""){
   events.forEach(function(element) 
    {
    var mymessages=element.message;
    var parts = mymessages.split('"'); 
    if(parts[2]==' Added Access Group ')
    {
        cron_mod.save_logs_into_db('GG','ADD',mymessages,1);
   // console.log("RUN ACCESS GROUPS CRON");
    var access_groups=cron_mod.get_gallagher_access_groups();
    access_groups.then(groups=>{
    var mygroups=JSON.stringify(groups);
    var syncdata=cron_mod.save_gg_access_groups_in_server(mygroups,'');
    syncdata.then(res=>{
    //console.log(res);
    });
    });


    }
    else if(parts[2]==' Added Card Type ')
    {
        cron_mod.save_logs_into_db('GG','ADD',mymessages,1);
  //  console.log("RUN ACCESS CARD TYPES CRON");
    var access_types=cron_mod.get_gallagher_card_types();
    access_types.then(types=>{
    var  mycardtypes=JSON.stringify(types);
    var syncdata=cron_mod.save_gg_card_types_in_server(mycardtypes,'');
    syncdata.then(res=>{
  //  console.log(res);
    });
    });


    } 
    else if(parts[2]==' Added Access Zone ')
    {
        cron_mod.save_logs_into_db('GG','ADD',mymessages,1);
    //console.log("RUN ACCESS ZONES CRON");
    var access_zones=cron_mod.get_gallagher_zones();
    access_zones.then(zones=>{
    var myzones=JSON.stringify(zones);
    var syncdata=cron_mod.save_gg_access_zones_in_server(myzones,'');
    syncdata.then(res=>{
    // console.log(res);
    });
    });

    }  
    else if(parts[2]==' Added Door ')
    {
        cron_mod.save_logs_into_db('GG','ADD',mymessages,1);
  //  console.log("RUN ACCESS DOORS CRON");
    var access_doors=cron_mod.get_gallagher_doors();
    access_doors.then(doors=>{
    var mydoors=JSON.stringify(doors);
    var syncdata=cron_mod.save_gg_doors_in_server(mydoors,'');
    syncdata.then(res=>{
    //  console.log(res);
    });
    });

    }
    else if(parts[2]==' Added Division ')
    {
        cron_mod.save_logs_into_db('GG','ADD',mymessages,1);
  //  console.log("RUN ACCESS DIVISIONS CRON");
    var divisions=cron_mod.get_gallagher_divisions();
    divisions.then(groups=>{
    var mydivisions=JSON.stringify(groups);
    var syncdata=cron_mod.save_gg_divisions_in_server(mydivisions,'');
    syncdata.then(res=>{
    //  console.log(res);
    });
    });

    }
   resolve(true);
    });
}else{
    resolve(false);
}  
    }).catch(error =>  {
        resolve(false);
    	//console.log(error)
    
    });
    //=====================UPDATE GROUPSSS======
    axios({
        method: 'get',
        httpsAgent: extagent,
        url:  constants.GALLAGHER_HOST + '/api/events?bottom=5000&type=15005&after='+transactions_time,
        headers: {
            'Authorization': apiKey,
            'Content-Type' : 'application/json'
          }
      })
    .then(function (response) {  
    var events=response.data.events;
   if(events!=""){
   events.forEach(function(element) 
    {
       
    var mymessages=element.message;
    var parts = mymessages.split('"'); 
    //console.log(parts);
    if(parts[2]==' Modified Access Group ')
    {
    cron_mod.save_logs_into_db('GG','UPDATE',mymessages,1);
    console.log("RUN UPDATE ACCESS GROUPS CRON");
    var access_groups=cron_mod.get_gallagher_access_groups();
    access_groups.then(groups=>{
    var mygroups=JSON.stringify(groups);
    var syncdata=cron_mod.save_gg_access_groups_in_server(mygroups,'');
    syncdata.then(res=>{
    console.log(res);
    });
    });


    }
    else if(parts[2]==' Modified Card Type ')
    {
        cron_mod.save_logs_into_db('GG','UPDATE',mymessages,1);
    console.log("RUN UPDATE ACCESS CARD TYPES CRON");
    var access_types=cron_mod.get_gallagher_card_types();
    access_types.then(types=>{
    var  mycardtypes=JSON.stringify(types);
    var syncdata=cron_mod.save_gg_card_types_in_server(mycardtypes,'');
    syncdata.then(res=>{
    console.log(res);
    });
    });


    } 
    else if(parts[2]==' Modified Access Zone ')
    {
        cron_mod.save_logs_into_db('GG','UPDATE',mymessages,1);
    console.log("RUN UPDATE ACCESS ZONES CRON");
    var access_zones=cron_mod.get_gallagher_zones();
    access_zones.then(zones=>{
    var myzones=JSON.stringify(zones);
    var syncdata=cron_mod.save_gg_access_zones_in_server(myzones,'');
    syncdata.then(res=>{
    // console.log(res);
    });
    });

    }  
    else if(parts[2]==' Modified Door ')
    {
    console.log("RUN UPDATE ACCESS DOORS CRON");
    cron_mod.save_logs_into_db('GG','UPDATE',mymessages,1);
    var access_doors=cron_mod.get_gallagher_doors();
    access_doors.then(doors=>{
    var mydoors=JSON.stringify(doors);
    var syncdata=cron_mod.save_gg_doors_in_server(mydoors,'');
    syncdata.then(res=>{
    //  console.log(res);
    });
    });

    }
    else if(parts[2]==' Modified Division ')
    {
        cron_mod.save_logs_into_db('GG','UPDATE',mymessages,1);
    console.log("RUN UPDATE ACCESS DIVISIONS CRON");
    var divisions=cron_mod.get_gallagher_divisions();
    divisions.then(groups=>{
    var mydivisions=JSON.stringify(groups);
    var syncdata=cron_mod.save_gg_divisions_in_server(mydivisions,'');
    syncdata.then(res=>{
    //  console.log(res);
    });
    });

    }
   resolve(true);
    });
}else{
   
    resolve(false);
}  
    }).catch(error =>  {
        resolve(false);
    //	console.log(error)
    
    });

    //==========================================
 //=====================DELETED GROUPS======
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/events?bottom=5000&type=15004&after='+transactions_time,
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
        .then(function (response) {  
        var events=response.data.events;
       if(events!=""){
       events.forEach(function(element) 
        {
           
        var mymessages=element.message;
        var parts = mymessages.split('"'); 
      //  console.log(parts);
        if(parts[2]==' Deleted Access Group ')
        {
            cron_mod.save_logs_into_db('GG','DELETE',mymessages,1);
            var elem=parts[3].trim();
      //  console.log("RUN DELETED ACCESS GROUPS CRON");
        var access_groups=cron_mod.get_gallagher_access_groups();
        access_groups.then(groups=>{
        var mygroups=JSON.stringify(groups);
        var syncdata=cron_mod.save_gg_access_groups_in_server(mygroups,elem);
        syncdata.then(res=>{
     //   console.log(res);
        });
        });
    
    
        }
        else if(parts[2]==' Deleted Card Type ')
        {
            cron_mod.save_logs_into_db('GG','DELETE',mymessages,1);
            var elem=parts[3].trim();
        console.log("RUN UPDATE ACCESS CARD TYPES CRON");
        var access_types=cron_mod.get_gallagher_card_types();
        access_types.then(types=>{
        var  mycardtypes=JSON.stringify(types);
        var syncdata=cron_mod.save_gg_card_types_in_server(mycardtypes,elem);
        syncdata.then(res=>{
        console.log(res);
        });
        });
    
    
        } 
        else if(parts[2]==' Deleted Access Zone ')
        {
            cron_mod.save_logs_into_db('GG','DELETE',mymessages,1);
            var elem=parts[3].trim();
       // console.log("RUN UPDATE ACCESS ZONES CRON");
        var access_zones=cron_mod.get_gallagher_zones();
        access_zones.then(zones=>{
        var myzones=JSON.stringify(zones);
        var syncdata=cron_mod.save_gg_access_zones_in_server(myzones,elem);
        syncdata.then(res=>{
        // console.log(res);
        });
        });
    
        }  
        else if(parts[2]==' Deleted Door ')
        {
            cron_mod.save_logs_into_db('GG','DELETE',mymessages,1);
            var elem=parts[3].trim();
      //  console.log("RUN UPDATE ACCESS DOORS CRON");
        var access_doors=cron_mod.get_gallagher_doors();
        access_doors.then(doors=>{
        var mydoors=JSON.stringify(doors);
        var syncdata=cron_mod.save_gg_doors_in_server(mydoors,elem);
        syncdata.then(res=>{
        //  console.log(res);
        });
        });
    
        }
        else if(parts[2]==' Deleted Division ')
        {
            cron_mod.save_logs_into_db('GG','DELETE',mymessages,1);
            var elem=parts[3].trim();
      //  console.log("RUN UPDATE ACCESS DIVISIONS CRON");
        var divisions=cron_mod.get_gallagher_divisions();
        divisions.then(groups=>{
        var mydivisions=JSON.stringify(groups);
        var syncdata=cron_mod.save_gg_divisions_in_server(mydivisions,elem);
        syncdata.then(res=>{
        //  console.log(res);
        });
        });
    
        }
       resolve(true);
        });
    }else{
       
        resolve(false);
    }  
        }).catch(error =>  {
            resolve(false);
          //  console.log(error)
        
        });
    
        //==========================================




}catch(error)
    {
        resolve(false);
    }



    });

}
exports.trigger_events_add_modify= function(){
//console.log("TRIGGER");
var dbDate = new Date().toLocaleString();
var seconds = 15;
var parsedDate = new Date(Date.parse(dbDate))
var newDate = new Date(parsedDate.getTime() - (1000 * 2))  
newDate=newDate.toISOString();
    return new Promise((resolve) => {
        try{
    
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/events?bottom=5000&type=15005&after='+newDate,
            headers: {
                'Authorization': apiKey,
                'Content-Type' : 'application/json'
              }
          })
            .then(function (response) {  
            var events=response.data.events;
            if(events!=""){
            
                var event_id=0;
            events.forEach(function(element) 
            {
             if(element.cardholder)
             {
                 if(event_id==0){
                event_id=element.id;
              //   console.log("EVENT_ID"+element.id);
                 var cardholder_id=element.cardholder.id;
                 var records=cron_mod.get_cardholders_details_from_events(cardholder_id);
                 records.then(rest=>{
                     if(rest)
                     {
                      var intervalxxx = setInterval(function() {
                         console.log("ENTERED");
                        var add_user_events=JSON.stringify(rest);
                        console.log(add_user_events);
                        var syncdata=cron_mod.save_gg_cardholders_on_server(add_user_events);
                        
                        syncdata.then(res=>{
                       console.log(res);
                        });
                        
                        clearInterval(intervalxxx);
                    }, 500);
                     }else{
                        // console.log("NO VALID");
                     } 
                 
                  
                 });
                 
                }
             }

            })

        
            }
            })
        }catch(error)
        {
            console.log("ERROR");
        }
    });
}
//==============================================================
function formatDate(date){
    return ('{0}-{1}-{3}T{4}:{5}:{6}Z').replace('{0}', date.getFullYear()).replace('{1}', date.getMonth() + 1).replace('{3}', date.getDate()).replace('{4}', (date.getHours() < 10 ? '0' : '')+date.getHours()).replace('{5}', (date.getMinutes() < 10 ? '0' : '')+date.getMinutes()).replace('{6}', (date.getSeconds() < 10 ? '0' : '')+date.getSeconds())
}