const express= require("express");
var axios = require('axios');
var qs = require('qs');
var mqtt = require('mqtt');
var constants=require("../constants.js");
var sf = require('sf');
var fr_mod = require('../modules/fr_module');
var gr_mod = require('../modules/gallagher_module');
var lift_mod = require('../modules/lift_module');
var cron_mod = require('../modules/cron_module');
var  client;
var clientId;
var host;
var options;


let router=express.Router();
var gala;
var face;
var lifts;
var picture;
router.use(function(req,res,next)
{
	console.log(req.url,"@", Date.now());
	next();
});
router.route('/configuration')
.get((req,res)=>{

	res.send("Hy this is mqtt get config");  

})
.post((req,res)=>{
    res.send("Hy this is mqtt post config");  

});

//=====================SECTION to RUN Cron JOBS===============
run_cron_for_gallagher_configuration();
run_cron_for_gallagher_events();
run_cron_for_gallagher_delete_user();
if(constants.EXPORT_CARDHOLDER_CRON==1){
	
	run_cron_for_gallagher_add_user();
}
 
function run_cron_for_gallagher_configuration(){
var intervalss = setInterval(function() {
var mydivisions;
var mygroups;
var myzones;
var mydoors;
var mycardtypes;
var divisions=cron_mod.get_gallagher_divisions();
divisions.then(groups=>{
	mydivisions=JSON.stringify(groups);
var syncdata=cron_mod.save_gg_divisions_in_server(mydivisions);
syncdata.then(res=>{
//  console.log(res);
});
});
var access_groups=cron_mod.get_gallagher_access_groups();
access_groups.then(groups=>{
mygroups=JSON.stringify(groups);
var syncdata=cron_mod.save_gg_access_groups_in_server(mygroups);
syncdata.then(res=>{
//  console.log(res);
});
});
var access_zones=cron_mod.get_gallagher_zones();
access_zones.then(zones=>{
	myzones=JSON.stringify(zones);
	var syncdata=cron_mod.save_gg_access_zones_in_server(myzones);
syncdata.then(res=>{
// console.log(res);
});
});
var access_doors=cron_mod.get_gallagher_doors();

access_doors.then(doors=>{
// console.log(doors);
mydoors=JSON.stringify(doors);
var syncdata=cron_mod.save_gg_doors_in_server(mydoors);
syncdata.then(res=>{
//  console.log(res);
});
});
var access_types=cron_mod.get_gallagher_card_types();
access_types.then(types=>{
	mycardtypes=JSON.stringify(types);
	var syncdata=cron_mod.save_gg_card_types_in_server(mycardtypes);
syncdata.then(res=>{
// console.log(res);
});
});
	
  }, constants.DEFAULT_GG_CONFIGURATION_CRON_TIME);

}
function run_cron_for_gallagher_events(){
	var intervaly = setInterval(function() 
	{
	var checkin_events;
	var checkout_events;
	
	var checkin=cron_mod.get_gallagher_checkin_events();
	checkin.then(groups=>{
		if(groups.length>0){
	checkin_events=JSON.stringify(groups);
	var syncdata=cron_mod.save_gg_checkin_checkout_events_in_server(checkin_events);
	syncdata.then(res=>{
	//  console.log(res);
	});
		}
	});	
	
	var checkout=cron_mod.get_gallagher_checkout_events();
	
	checkout.then(groups=>{
		if(groups.length>0){
	checkout_events=JSON.stringify(groups);
	var syncdata=cron_mod.save_gg_checkin_checkout_events_in_server(checkout_events);
	syncdata.then(res=>{
	//  console.log(res);
	});
		}
	});
	
	  }, constants.DEFAULT_EVENT_CRON_JOB_TIME);
	
}
function run_cron_for_gallagher_delete_user(){
	var intervaly = setInterval(function() 
	{
	var delete_user_events;
	var del_user=cron_mod.check_gallagher_delete_cardholder_events();
	
	del_user.then(groups=>{
		if(groups.length>0){
	delete_user_events=JSON.stringify(groups);
	var syncdata=cron_mod.check_gg_user_data_deleted_from_server(delete_user_events);
	syncdata.then(res=>{
	 //console.log(res);
	});
	 
		}
	});	
	
	
	  }, constants.DEFAULT_DELETE_EVENT_CRON_TIME);
	
}
function run_cron_for_gallagher_add_user(){
	var intervalz = setInterval(function() 
	{
	var add_user_events;
	var add_user=cron_mod.check_gallagher_add_cardholder_events();
	add_user.then(groups=>{
		if(groups.length>0){
	add_user_events=JSON.stringify(groups);
	var syncdata=cron_mod.save_gg_cardholders_on_server(add_user_events);
	syncdata.then(res=>{
   console.log(res);
	});
	 
		}
	});	
	
	
	  }, constants.DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME);
	
}

client=configuration_mqtt();
function configuration_mqtt()
{
	 clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
	 host = constants.MQTT_HOST
	options = {
		keepalive: 30,
		clientId: clientId,
		protocolId: 'MQTT',
		protocolVersion: 4,
		clean: false,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
		rejectUnauthorized: false,
		username:constants.MQTT_USERNAME,
		password:constants.MQTT_PASSWORD
	}
	console.log('connecting mqtt client')
client = mqtt.connect(host, options)
return client;	
}
client.on('error', function (err) {
	console.log(err)
	client.end()
})



client.on('connect', function () {
	
	console.log('client connected:' + clientId)
	//console.log('client connected:' + host)
	client.subscribe('live_request', { qos: 1 })

})

client.on('message', function (topic, message, packet) {
	
	var result_array=[];
	var msg = message.toString();
	
	var msg_arr = msg.split('***||***');
	
	var msgtopic = msg_arr[0];
	var req_method = msg_arr[2];
	var req_code = msg_arr[3];
	
	if(req_code==constants.CODE){
		
//=============================PERMANENT USERS============================//
if(req_method == 'checking_server'){
	//console.log("SERVER IS WORKING");
	 client.publish(msgtopic, JSON.stringify('success'), { qos: 1, response: false })					
 }
	////////////////////add cards to devices///////////////////////////
	if(req_method == 'add_gg_users'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
		 var personal_info = data_obj['personal'];
		 var groups = data_obj['GG']['groups'].join(",");
		 var cardtypes = data_obj['GG']['cards'];
		 var cardholder_id = gr_mod.save_user_in_gallagher(personal_info,cardtypes,groups)
		 cardholder_id.then(gala_resp=>{		
				 var gg = gala_resp[0]['GG']['person_id'];
			 console.log("USER_GG="+gg);
		 client.publish(msgtopic, JSON.stringify(gala_resp[0]), { qos: 1, response: false })					

		 });

	 }
	 if(req_method == 'add_fr_users'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
		 var personal_info = data_obj['personal'];
		 var groups = data_obj['FR']['groups'].join(",");
		 var cardtypes = data_obj['FR']['cards'];
		 var card_number = data_obj['FR']['cards'][0];
							
		 var face_id = fr_mod.add_fr_user(personal_info,card_number,data_obj['personal']['org'])
		 face_id.then(facerep=>{
			var gg = facerep[0]['FR']['person_id'];
			console.log("USER_FR="+gg);
		client.publish(msgtopic, JSON.stringify(facerep[0]), { qos: 1, response: false })	 
		 });
							


	 }
	 if(req_method == 'add_sl_users'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
		 var personal_info = data_obj['personal'];
		 var lift_groups = data_obj['SL']['groups'].join(",") ;
		 var lift_cards = data_obj['SL']['cards'][0];
		 var person_id=data_obj['SL']['personID'];
		 var lift_id = lift_mod.add_lift_user(personal_info,person_id,lift_groups,lift_cards)
		 lift_id.then( liftrep => {
			 
			var gg = liftrep[0]['SL']['person_id'];
			console.log("USER_SL="+gg);
		client.publish(msgtopic, JSON.stringify(liftrep[0]), { qos: 1, response: false })
			 
		 });				
	 }
	 
	///////////////////////////////////////////////////////////////////
	
	////////////////////delete profile to devices////////////////////////
    if(req_method == 'delete_gg_users'){
		var msgcontent = 'Data Recieved';
		var data_obj = JSON.parse( msg_arr[1] ); 
		var gg_person_id = data_obj['GG']['person_id'];
		var cardholder_id = gr_mod.delete_cardholder_details(gg_person_id)
		cardholder_id.then(gala_resp=>{	
		   console.log("DELETED_USER__GG="+gg_person_id);
	   client.publish(msgtopic, JSON.stringify(gala_resp), { qos: 1, response: false })	 
		});

	 }
	 if(req_method == 'delete_fr_users'){
		var data_obj = JSON.parse( msg_arr[1] );
		var fr_person_id = data_obj['FR']['person_id'];			
		var face_id = fr_mod.delete_fr_user(fr_person_id)
		face_id.then(facerep=>{
		   console.log("DELETED_USER__FR="+fr_person_id);
	   client.publish(msgtopic, JSON.stringify(facerep), { qos: 1, response: false })	 
		});
	 }
	 if(req_method == 'delete_sl_users'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
		 var lift_person_id = data_obj['SL']['person_id'];
		 var lift_id = lift_mod.delete_lift_user(lift_person_id)
		 lift_id.then( liftrep => {	 	
			console.log("DELETED_USER__SL="+lift_person_id);
		client.publish(msgtopic, JSON.stringify(liftrep), { qos: 1, response: false })	 
		 });				
	 }

	////////////////////update cards to devices////////////////////////
	if(req_method == 'update_gg_users'){
		var msgcontent = 'Data Recieved';
		var data_obj = JSON.parse( msg_arr[1] ); 
		var gg_person_id = data_obj['GG']['person_id'];
		var gg_cards = data_obj['GG']['cards'];
			var cardholder_id = gr_mod.update_card_status(data_obj['GG']['firstname'],data_obj['GG']['lastname'],gg_person_id,gg_cards)
			cardholder_id.then(gala_resp=>{				
				if(gala_resp){
					console.log("GG EXPIRY UPDATED");	
			 client.publish(msgtopic, JSON.stringify(gala_resp), { qos: 1, response: false })
				}else{
					console.log("GG EXPIRY FAILED TO UPDATE");
			client.publish(msgtopic, JSON.stringify(gala_resp), { qos: 1, response: false })
				}	
			});	
	 }
	 if(req_method == 'update_fr_users'){
		var data_obj = JSON.parse( msg_arr[1] );
		var fr_person_id = data_obj['FR']['person_id'];
		var fr_cards = data_obj['FR']['cards'];
		var face_id = fr_mod.add_update_fr_card(data_obj['FR']['firstname'],data_obj['FR']['lastname'],fr_person_id,fr_cards[0])
			face_id.then(face_resp=>{		

			if(face_resp){
				console.log("FR EXPIRY UPDATED");
			client.publish(msgtopic, JSON.stringify(face_resp), { qos: 1, response: false })
			}else{
				console.log("FR EXPIRY FAILED TO UPDATE");
			client.publish(msgtopic, JSON.stringify(face_resp), { qos: 1, response: false })
			}

			});
	 }
	 if(req_method == 'update_sl_users'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
		 var sl_person_id = data_obj['SL']['person_id'];
		 var sl_cards = data_obj['SL']['cards'];
		 var lift_groups = data_obj['SL']['groups'].join(",") ;
		 var flift_id = lift_mod.update_lift_user(data_obj['SL']['firstname'],data_obj['SL']['lastname'],data_obj['SL']['pname'],sl_person_id,sl_cards[0],data_obj['SL']['level'],lift_groups)
		 flift_id.then(lift_resp=>{					
						 if(lift_resp){
							console.log("SL EXPIRY UPDATED");	 
							client.publish(msgtopic, JSON.stringify(lift_resp), { qos: 1, response: false })
						 }else{
							console.log("SL EXPIRY FAILED TO UPDATE");
							client.publish(msgtopic, JSON.stringify(lift_resp), { qos: 1, response: false })
						 }
						
					 });				
	 }
	///////////////////////////////////////////////////////////////////
	//=============================END================================
	//=============================VISITORS===========================

		////////////////////add IN ///////////////////////////
		if(req_method === 'add_gg_visitor'){
			   var msgcontent = 'Data Recieved';
				var data_obj = JSON.parse( msg_arr[1] ); 
				
			    var personal_info = data_obj['personal'];
			    var groups = data_obj['GG']['groups'].join(",");
				var cardtypes = data_obj['GG']['cards'];
				var cardholder_id = gr_mod.save_visitor_in_gallagher(personal_info,cardtypes,groups)
				cardholder_id.then(gala_resp=>{		
						var gg = gala_resp[0]['GG']['person_id'];
					console.log("GG="+gg);
				client.publish(msgtopic, JSON.stringify(gala_resp[0]), { qos: 1, response: false })					
	
				});
	
		}
		if(req_method === 'add_fr_visitor'){
			var msgcontent = 'Data Recieved';
			 var data_obj = JSON.parse( msg_arr[1] ); 
			 var personal_info = data_obj['personal'];
			 var card_number = data_obj['FR']['cards'][0];				
			 var face_id = fr_mod.add_fr_user(personal_info,card_number,data_obj['personal']['org'])
			 face_id.then(facerep=>{ 	 
				 var fr = facerep[0]['FR']['person_id'];
				 console.log("FR="+fr);
			 client.publish(msgtopic, JSON.stringify(facerep[0]), { qos: 1, response: false })					

			 });
	 }
		if(req_method === 'add_sl_visitor'){
				var msgcontent = 'Data Recieved';
				var data_obj = JSON.parse( msg_arr[1] ); 
				var personal_info = data_obj['personal'];
				var lift_groups = data_obj['SL']['groups'].join(",") ;
				var person_id=data_obj['SL']['personID'];
				var lift_cards = data_obj['SL']['cards'][0];
				var lift_id = lift_mod.add_lift_user(personal_info,person_id,lift_groups,lift_cards)
				lift_id.then( liftrep => {

					var sl = liftrep[0]['SL']['person_id'];
					console.log("SL="+sl);
				client.publish(msgtopic, JSON.stringify(liftrep[0]), { qos: 1, response: false })					
			
				});
		}

		///////////////////////////////////////////////////////////////////
  
	//===============================================================
	}	
})

client.on('close', function () {
	  console.log(clientId + ' disconnected')
	  configuration_mqtt();
	  
})


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

module.exports=router;