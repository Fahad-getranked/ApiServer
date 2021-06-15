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

router.post('/fr_camera_events', function (req, res) {
	console.log("Getting Data From Camera Event....");
	console.log(req.body.params.events);
	
	});
router.post('/fr_transactions', function (req, res) {
	console.log("Getting Data....");
	//console.log(req.body.params.events[0]);
	var rest=true;
	  var maindata=[];
if(req.body.params.events[0].data!=null)
{ 
	
	console.log("Transactions....");
	var eventData={
		"personCode":req.body.params.events[0].data.personCode,
		"cardNo":req.body.params.events[0].data.cardNo,
		"checkInAndOutType":req.body.params.events[0].data.checkInAndOutType,
		"personId":req.body.params.events[0].data.personId,
		"temperatureData":req.body.params.events[0].data.temperatureData,
		"temperatureStatus":req.body.params.events[0].data.temperatureStatus,
		"wearMaskStatus":req.body.params.events[0].data.wearMaskStatus,
		"eventId":req.body.params.events[0].eventId,
		"srcType":req.body.params.events[0].srcType,
		"srcIndex":req.body.params.events[0].srcIndex,
		"srcName":req.body.params.events[0].srcName,
		"eventType":req.body.params.events[0].eventType,
		"happenTime":req.body.params.events[0].happenTime 

	}


	maindata.push(eventData);
	maindata=JSON.stringify(maindata);
	console.log(maindata);
	var syncdata=cron_mod.save_fr_transactions(maindata);
	syncdata.then(res=>{
console.log(res);
	});
}else{
	rest=false;
}	


res.send(rest);
	});
	router.post('/fr_faces_transactions', function (req, res) {
		console.log("Getting Face Data....");
		
		var rest=true;
		  var maindata=[];
	if(req.body.params.events[0].data!=null)
	{ 
		var mydata=cron_mod.download_fr_image(req.body.params.events[0].data.picUri);
		mydata.then(respp=>{
	 var eventData={
		  'pic':respp,
		  "temperature":req.body.params.events[0].data.temperatureData,
		  "door_id":req.body.params.events[0].srcIndex,
		}
		maindata.push(eventData);
		maindata=JSON.stringify(maindata);
	var syncdata=cron_mod.save_fr_images(maindata);
			syncdata.then(res=>{
	console.log(res);
		});
		});
	
	}else{
		rest=false;
	}	
	
	
	res.send(rest);
		});
//=====================SECTION to RUN Cron JOBS===============
run_cron_for_gallagher_configuration();
run_cron_for_gallagher_events();
run_cron_for_gallagher_delete_user();
run_cron_for_fr_event_subscription();
if(constants.EXPORT_CARDHOLDER_CRON==1){
	
	run_cron_for_gallagher_add_user();
}
if(constants.EXPORT_FR_USER_CRON==1){
	
	run_cron_for_fr_add_user();
}
function run_cron_for_gallagher_configuration(){
var intervalss = setInterval(function() {
var mydivisions;
var myorgs;
var mygroups;
var myzones;
var mydoors;
var mycardtypes;
var myfrgroups;
var frdoors;
var divisions=cron_mod.get_gallagher_divisions();
divisions.then(groups=>{
	mydivisions=JSON.stringify(groups);
var syncdata=cron_mod.save_gg_divisions_in_server(mydivisions);
syncdata.then(res=>{
//  console.log(res);
});
});
var orginazations=cron_mod.get_fr_organizations();
orginazations.then(groups=>{
	myorgs=JSON.stringify(groups);
	
var syncdata=cron_mod.save_fr_org_in_server(myorgs);
syncdata.then(res=>{
//   console.log(res);
});
});
var frgroups=cron_mod.get_fr_groups();
frgroups.then(groups=>{
	myfrgroups=JSON.stringify(groups);
	
var syncdata=cron_mod.save_fr_group_in_server(myfrgroups);
syncdata.then(res=>{
 
});
});
var dor=cron_mod.get_fr_doors();
dor.then(groups=>{
	frdoors=JSON.stringify(groups);
	
var syncdata=cron_mod.save_fr_doors_in_server(frdoors);
syncdata.then(res=>{
 
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


//*****************************Camera Listings**********************************
//******************************************************************************

function get_camera_thumbnail(cameraIndexCode) {
	return new Promise(resolve => {
		var thumbnail =cron_mod.get_cameras_thumbnail(cameraIndexCode);
		thumbnail.then(b64_image=>{
			
			resolve(b64_image);
		});
	});
}

function get_camera_listings(){

	return new Promise(resolve => {
		var cameras=cron_mod.get_cameras_listing_from_hikcentral();

		cameras.then(cameras=>{
			resolve(cameras);
		});
	});
}
  
async function asyncCall_for_camera_listing() {
	
	const cameras = await get_camera_listings();

	for (var i = cameras.length - 1; i >= 0; i--) {

		var cameraIndexCode = cameras[i].cameraIndexCode;
		cameras[i].image = await get_camera_thumbnail(cameraIndexCode);
		
	}
	
	//console.log(cameras);
	cam_data=JSON.stringify(cameras);
	
	
	var syncdata=cron_mod.save_cameras_in_server(cam_data);
	syncdata.then(res=>{
		//console.log(res);
	});
	
}

asyncCall_for_camera_listing();

//******************************************************************************
//******************************************************************************







  }, constants.DEFAULT_GG_CONFIGURATION_CRON_TIME);

}

function run_cron_for_gallagher_events(){
	var intervaly = setInterval(function() 
	{
	var checkin_events;
	var checkout_events;
	var noentry_events;
	var doors_events;
	
	var checkin=cron_mod.get_gallagher_all_events();
	checkin.then(groups=>{
		if(groups.length>0){
			//console.log("Total Length="+groups.length);
	 checkin_events=JSON.stringify(groups);
	//console.log(checkin_events);
	var syncdata=cron_mod.save_gg_checkin_checkout_events_in_server(checkin_events);
	syncdata.then(res=>{
	 //console.log(res);
	});
		}
	});	
	var dooeevent=cron_mod.get_gallagher_door_alarms();
	dooeevent.then(groups=>{
		if(groups.length>0){
			doors_events=JSON.stringify(groups);
	var syncdata=cron_mod.save_gg_ndoor_alarms_events_in_server(doors_events);
	syncdata.then(res=>{
//console.log(res);
	});
		}
	});
	// var checkout=cron_mod.get_gallagher_checkout_events();
	
	// checkout.then(groups=>{
	// 	if(groups.length>0){
	// 		console.log("checkout Length"+groups.length);
	// // checkout_events=JSON.stringify(groups);
	// // var syncdata=cron_mod.save_gg_checkin_checkout_events_in_server(checkout_events);
	// // syncdata.then(res=>{
	// // //  console.log(res);
	// // });
	// 	}
	// });
	

// 	var noentry=cron_mod.get_gallagher_no_entry_events();
	
// 	noentry.then(groups=>{
// 		if(groups.length>0){
// 	// 		noentry_events=JSON.stringify(groups);
// 	// var syncdata=cron_mod.save_gg_noentry_events_in_server(noentry_events);
// 	// syncdata.then(res=>{
// 	//   //console.log(res);
// 	// });
// 		}
// 	});


	

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
function run_cron_for_fr_add_user(){
	var intervalz = setInterval(function() 
	{
	var add_user_events;
	var add_user=cron_mod.check_fr_add_users_events();
	add_user.then(groups=>{
		if(groups.length>0){
	add_user_events=JSON.stringify(groups);

	var syncdata=cron_mod.save_fr_users_on_server(add_user_events);
	syncdata.then(res=>{
   console.log(res);
	});
	 
		}
	});	
	
	
	  }, constants.DEFAULT_ADD_FR_USER_EVENT_CRON_TIME);
	
}
function run_cron_for_fr_event_subscription(){
	var face_thermal_events = setInterval(function() 
	{

	var sbscription=cron_mod.check_fr_get_event_subscription();
	sbscription.then(groups=>{
		console.log(groups);
		if(groups==-1){
		var data={eventDest: constants.FR_SUBSCRIPTION+'/mqtt_client/fr_transactions',
				eventTypes: [constants.FR_FACE_EVENT_CODE]
			}
// var data={eventDest: constants.FR_SUBSCRIPTION+'/mqtt_client/fr_transactions',
		// 		eventTypes: [131659,1482753,49697,197160,193,197151,194]
		// 	}
		var data='{"eventDest":"'+constants.FR_SUBSCRIPTION+'/mqtt_client/fr_transactions","eventTypes":['+constants.FR_FACE_EVENT_CODE+']}';
		var thermal_event=cron_mod.save_fr_get_event_subscription(data);
		thermal_event.then(face_resp=>{
			if(face_resp){
		var data='{"eventDest":"'+constants.FR_SUBSCRIPTION+'/mqtt_client/fr_faces_transactions","eventTypes":['+constants.FR_THERMAL_CAMERA_EVENT_CODE+']}';
		var face_event=cron_mod.save_fr_get_event_subscription(data);
		thermal_event.then(thermal_resp=>{
			if(thermal_resp){
				console.log("Events Successfully Subscribed");
		clearInterval(face_thermal_events); 
			}
		});
			}
		});
		
		}else{
			console.log("Events Successfully Subscribed");
			clearInterval(face_thermal_events); 
		}
	});
	
	
	
	
	  }, 5000);
	
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
 //======================CHECK USER EXISTIS===================
 if(req_method == 'fr_user_exist'){
	var msgcontent = 'Data Recieved';
	 var data_obj = JSON.parse( msg_arr[1] ); 
	 var personal_info = data_obj['person_name'];

	 var fr_user = fr_mod.get_existing_users_by_name(personal_info)
	 fr_user.then(frr_resp=>{	
	 client.publish(msgtopic, JSON.stringify(frr_resp), { qos: 1, response: false })					

	 });

 }
 //======================Update Face===================
 if(req_method == 'fr_update_user_face'){
	var msgcontent = 'Data Recieved';
	 var data_obj = JSON.parse( msg_arr[1] ); 
	 var image_url = data_obj['image_url'];
	 var user_id = data_obj['person_id'];
	 var org_id = data_obj['org_id'];
	 var card_number = data_obj['card_number'];

	 var fr_user = fr_mod.updat_user_face(image_url,user_id,org_id,card_number);
	 fr_user.then(frr_resp=>{	
	 client.publish(msgtopic, JSON.stringify(frr_resp), { qos: 1, response: false })					

	 });

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
	////////////////////update Card Info//////////////////////////
		if(req_method == 'update_user_card_details'){
			var msgcontent = 'Data Recieved';
			console.log(msgcontent);
			 var data_obj = JSON.parse( msg_arr[1] ); 
				if(data_obj['GG']){
				var cardholder_id = gr_mod.delete_card_details(data_obj['GG']['user_id'],data_obj['GG']['card_id'])
				cardholder_id.then(gala_resp=>{		
				var gg = gala_resp[0]['GG']['person_id'];
				if(gg==0)
				{
				   
					client.publish(msgtopic, JSON.stringify({"message":"success"}), { qos: 1, response: false })	
				}else
				{
					client.publish(msgtopic, JSON.stringify({"message":"failed"}), { qos: 1, response: false })	
				}
								

				});
				}
				else if(data_obj['FR']){
					var fr_id = fr_mod.delete_fr_user(data_obj['FR']['user_id'])	
					fr_id.then(fr_resp=>{
								
					if(fr_resp)
					{
					
						client.publish(msgtopic, JSON.stringify({"message":"success"}), { qos: 1, response: false })	
					}else
					{
						client.publish(msgtopic, JSON.stringify({"message":"failed"}), { qos: 1, response: false })	
					}
									
	
					});
					}
					else if(data_obj['SL']){
						var lft_id = lift_mod.delete_lift_user(data_obj['SL']['user_id'])	
						lft_id.then(lf_resp=>{	
							if(lf_resp){		
							client.publish(msgtopic, JSON.stringify({"message":"success"}), { qos: 1, response: false })	
							}else{
							client.publish(msgtopic, JSON.stringify({"message":"failed"}), { qos: 1, response: false })	
							}
						});
						}
	
		 }
		 
	 //////////////////////////////////////////////////////////////
	 	////////////////////update Group Info//////////////////////////
		 if(req_method == 'delete_user_groups_details'){
			var msgcontent = 'Deleting data';
			console.log(msgcontent);
			 var data_obj = JSON.parse( msg_arr[1] ); 
				if(data_obj['GG']){
				var cardholder_id = gr_mod.get_cardholder_group_details(data_obj['GG']['user_id'])
				cardholder_id.then(gala_resp=>{	
					if(gala_resp){	
					client.publish(msgtopic, JSON.stringify({"message":"success"}), { qos: 1, response: false })			
				
					}else{
						client.publish(msgtopic, JSON.stringify({"message":"failed"}), { qos: 1, response: false })			
					}
				});
				}
				
	
		 }
		
		 if(req_method == 'update_user_groups_details'){
			var msgcontent = 'Adding Group Receved';
			console.log(msgcontent);
			 var data_obj = JSON.parse( msg_arr[1] ); 
				if(data_obj['GG']){
					var cardholder_id = gr_mod.get_cardholder_group_details(data_obj['GG']['user_id'])
					cardholder_id.then(gala_resp=>{	
						if(gala_resp){	
							var groups = data_obj['GG']['groups'].join(",");
			
							var newreq=gr_mod.add_new_groups_in_gallagher(data_obj['GG']['user_id'],groups);
							newreq.then(newreps=>{	
								if(newreps){
							client.publish(msgtopic, JSON.stringify({"message":"success"}), { qos: 1, response: false })	
								}else{
									client.publish(msgtopic, JSON.stringify({"message":"failed"}), { qos: 1, response: false })	
								}
						
						});
					
						}else{
							client.publish(msgtopic, JSON.stringify({"message":"failed"}), { qos: 1, response: false })			
						}
					});	
					
				}
				
		 }
     //////////////////////////////////////////////////////////////
	////////////////////ADD NEW Card Info//////////////////////////
		 if(req_method == 'add_user_card_details'){
			var msgcontent = 'Data Recieved';
			 var data_obj = JSON.parse( msg_arr[1] ); 
				if(data_obj['GG']){
				var cardholder_id = gr_mod.add_new_card_in_gallagher(data_obj['GG']['user_id'],data_obj['GG']['cards'])
				cardholder_id.then(gala_resp=>{		
					var gg = gala_resp[0]['GG']['person_id'];
					console.log("USER_GG="+gg);
				client.publish(msgtopic, JSON.stringify(gala_resp[0]), { qos: 1, response: false })
								

				});
				}
				
	
		 }	 
	////////////////////OPEN THE DDOR//////////////////////////
	if(req_method == 'open_the_door'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
			if(data_obj['GG']){
				
			var cardholder_id = gr_mod.open_the_door(data_obj['GG']['door_id'])
			cardholder_id.then(gala_resp=>{		
				
			client.publish(msgtopic, JSON.stringify(gala_resp), { qos: 1, response: false })
							

			});
			}
			

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