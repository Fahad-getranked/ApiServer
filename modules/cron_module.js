const express= require("express");
const axios = require('axios');
var dateFormat = require('dateformat');
var constants=require("../constants.js");
var cron_mod = require('../modules/cron_module');
var qs = require('qs');
const https=require("https");
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

const agent = new https.Agent({
    rejectUnauthorized: false
})
apiKey =constants.GALLAGHER_KEY;
extkey=apiKey;
extagent=agent


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
        '{"pageNo":1,"pageSize":100}' 
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
        '{"pageNo":1,"pageSize":100}' 
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
        '{"pageNo":1,"pageSize":100}' 
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
exports. get_gallagher_checkin_events=function()
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
            url:  constants.GALLAGHER_HOST + '/api/events?type=20001&after='+newDate,
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
            var date = new Date(element.time);
            var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");      
            var checkin_events={
                'external_id':element.id,
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
    var intervalxxx = setInterval(function() {

        resolve(obj);
        clearInterval(intervalxxx);
    }, 1000);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. get_gallagher_checkout_events=function()
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
            url:  constants.GALLAGHER_HOST + '/api/events?type=20003&after='+newDate,
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
                var date = new Date(element.time);
                var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");
            var checkin_events={
                'external_id':element.id,
                'cardholder_id':element.cardholder.id,
                'zone_id':element.exitAccessZone.id,
                'door_id':element.source.id,
                'type':0,
                'datetime':day,
                'cardnumber':cardnumber,
                'message':element.message

   
           };
        obj.push(checkin_events);
    
    
    });
    var intervalxxx = setInterval(function() {

        resolve(obj);
        clearInterval(intervalxxx);
    }, 1000);
  
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
        
        if(element.type.id==23035 || element.type.id==3300 || element.type.id==23032  || element.type.id==20013)
        {
           
                        if(element.source.id)
                        {
                        var door_id=element.source.id;
                        }else{
                        var door_id=0;
                        }
                        if(element.division.id)
                        {
                        var division_id=element.division.id;
                        }else{
                        var division_id=0;
                        }

                        if(element.card)
                        {
                        var card_number=element.card.number;
                        }else{
                        var card_number=0;
                        }
                        if(element.cardholder)
                        {
                        var cardholder_id=element.cardholder.id;
                        }else{
                        var cardholder_id=0;
                        }
                var date = new Date(element.time);
                var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");
            var checkin_events={
                'event_id':element.id,
                'priority':element.priority,
                'door_id':door_id,
                'type':element.type.id,
                'datetime':day,
                'division_id':division_id,
                'message':element.message,
                'card_number':card_number,
                'cardholder_id':cardholder_id,

   
           };
        obj.push(checkin_events);
    
        }
    
    });
    var intervalxxx = setInterval(function() {

        resolve(obj);
        clearInterval(intervalxxx);
    }, 1000);
  
             }).catch(error =>  {
        	console.log(error)
        
        });
  
    });
}
exports. get_gallagher_no_entry_events=function()
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
            url:  constants.GALLAGHER_HOST + '/api/events?type=20039&after='+newDate,
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
            var date = new Date(element.time);
            var day=dateFormat(date.toString(), "yyyy-mm-dd HH:MM:ss");      
            var noentry_events={
                'external_id':element.id,
                'cardholder_id':element.cardholder.id,
                'zone_id':element.entryAccessZone.id,
                'door_id':element.source.id,
                'type':1,
                'datetime':day,
                'cardnumber':cardnumber,
                'message':element.message

   
           };
        obj.push(noentry_events);
    
    
    });
    var intervalxxx = setInterval(function() {

        resolve(obj);
        clearInterval(intervalxxx);
    }, 1000);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
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
exports. save_gg_access_groups_in_server= function (access_groups)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_groups_in_gallagher?code='+constants.CODE,
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
exports. save_gg_divisions_in_server= function (divisions)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_divisions_in_gallagher?code='+constants.CODE,
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
exports. save_gg_access_zones_in_server= function (access_zones)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_zones_in_gallagher?code='+constants.CODE,
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
exports. save_gg_doors_in_server= function (doors)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_access_doors_in_gallagher?code='+constants.CODE,
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
exports. save_gg_card_types_in_server= function (card_types)
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'post',
            httpsAgent: extagent,
            url:  constants.BASE_SERVER_URL + '/save_data_of_card_types_in_gallagher?code='+constants.CODE,
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
          if(email!=""){
            var personal_info={
                 'personID':card_holder_id,    
                 'firstname':cardholderlist.data.firstName,
                 'lastname':cardholderlist.data.lastName,
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
             if(array_cards!=''){
                var mydata={
                    "personal":personal_info,
                    "groups":groups,
                    "cards":array_cards
                 }
              
            resolve(mydata); 
                } 
                }else{
                  
                    // resolve(''); //if email and phone exisits
                }
                        }else{
                          
                            // resolve(''); //Personal Fields
                        }
             }else{
                
                // resolve('');//if cardholder info exists
             }
            

                                    }else{
                                        // resolve('');//if api call is valid
                                    }



     }).catch(error =>  {
      // console.log(error);
     
     });
    }catch(error)
    {

    }
 }).catch(error =>  {
   // console.log(error);
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
        //	console.log(error)
        
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
        
 var url=constants.FR_HOST+'/api/FrData/';
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
        if(response.data.data.detail.length==2)
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
        
 var url=constants.FR_HOST+'/api/FrData/';
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
       
        var s=responsey.data.entryAccessZone.href;
        var zone_id=s.match(/([^\/]*)\/*$/)[1];
doorsarray={
 'd_id':responsey.data.id,
 'name':responsey.data.name,
 'zone_id':zone_id
}; 

resolve(doorsarray);

    });
});


}
function formatDate(date){
    return ('{0}-{1}-{3}T{4}:{5}:{6}Z').replace('{0}', date.getFullYear()).replace('{1}', date.getMonth() + 1).replace('{3}', date.getDate()).replace('{4}', (date.getHours() < 10 ? '0' : '')+date.getHours()).replace('{5}', (date.getMinutes() < 10 ? '0' : '')+date.getMinutes()).replace('{6}', (date.getSeconds() < 10 ? '0' : '')+date.getSeconds())
}