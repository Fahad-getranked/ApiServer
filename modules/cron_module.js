const express= require("express");
const axios = require('axios');
var dateFormat = require('dateformat');
var constants=require("../constants.js");
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
exports. get_gallagher_access_groups= function ()
{
    var obj = [];
	return new Promise((resolve) => {
        axios({
            method: 'get',
            httpsAgent: extagent,
            url:  constants.GALLAGHER_HOST + '/api/access_groups',
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
            url:  constants.GALLAGHER_HOST + '/api/access_zones',
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
            url:  constants.GALLAGHER_HOST + '/api/card_types',
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
            url:  constants.GALLAGHER_HOST + '/api/doors',
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
    var interval = setInterval(function() {

    resolve(objs);
    
}, 100);
if(objs!="")
    {
        clearInterval(interval);
    }
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
    resolve(obj);
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
    resolve(obj);
             }).catch(error =>  {
        //	console.log(error)
        
        });
  
    });
}
exports. check_gallagher_delete_cardholder_events=function()
{
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
            var events=response.data.events;
           
    events.forEach(function(element) {
	
            var checkin_events={
                'cardholder_id':element.cardholder.id,
           };
        obj.push(checkin_events);
     
    
    });
    resolve(obj);
             }).catch(error =>  {
        	//console.log(error)
        
        });
  
    });
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
//============================FACELESS INTEGRATION================================

















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