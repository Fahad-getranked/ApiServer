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
var BIOSTART = require('../modules/biostart_module');
var  client;
var clientId;
var host;
var options;
let router=express.Router();
var mylogin=false;
// var bs_scan=cron_mod.Login_into_device();
// bs_scan.then(login=>{
// 	if(login)
// 	{
// 		mylogin=login;
// 		console.log("UPDATED BS STATUS");
// 	   cron_mod.save_device_statuses(1,'BS');
// 	   cron_mod.update_device_statuses_into_db(1,'BS');
// 	}else{
// 		mylogin=false;
// 		cron_mod.update_device_statuses_into_db(0,'BS');
// 	}
// });
// router.post('/fr_camera_events', function (req, res) {
// 	console.log("Getting Data From Camera Event....");
// 	console.log(req.body.params.events);
// 	var rest=true;
// 	var maindata=[];
// if(req.body.params.events[0]!=null)
// { 
  
//   console.log("Transactions....");
//   var eventData={
	 
// 	  "eventId":req.body.params.events[0].eventId,
// 	  "eventType":req.body.params.events[0].eventType,
// 	  "srcType":req.body.params.events[0].srcType,
// 	  "srcIndex":req.body.params.events[0].srcIndex,
// 	  "srcName":req.body.params.events[0].srcName,
// 	  "status":req.body.params.events[0].status,
// 	  "happenTime":req.body.params.events[0].happenTime 

//   }


//   maindata.push(eventData);
//   maindata=JSON.stringify(maindata);
//   console.log(maindata);
//   var syncdata=cron_mod.save_fr_motion_detection_events(maindata);
//   syncdata.then(res=>{
// console.log(res);
//   });
// }else{
//   rest=false;
// }	


// res.send(rest);
// 	});
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
		clearInterval(intervalss);

//================================================
  }, constants.DEFAULT_GG_CONFIGURATION_CRON_TIME);

}
//====================================================
//===============RUN EVENTS ONLY ONE TIME==========
//======================================================
//*****************Gallagher************************ */
GG_config();
function GG_config(){

	gallagher_access_groups();
	gallagher_access_zones();
	gallagher_access_doors();
	gallagher_card_types();
	gallagher_access_divisions();
}
function gallagher_access_groups()
{
	var access_groups=cron_mod.get_gallagher_access_groups();
	access_groups.then(groups=>{
	var mygroups=JSON.stringify(groups);
	var syncdata=cron_mod.save_gg_access_groups_in_server(mygroups,'');
	syncdata.then(res=>{
	//  console.log(res);
	});
	});
}
function gallagher_access_zones()
{
var access_zones=cron_mod.get_gallagher_zones();
access_zones.then(zones=>{
	var  myzones=JSON.stringify(zones);
	var syncdata=cron_mod.save_gg_access_zones_in_server(myzones,'');
syncdata.then(res=>{
// console.log(res);
});
});
}
function gallagher_access_doors()
{
	var access_doors=cron_mod.get_gallagher_doors();
	access_doors.then(doors=>{
	// console.log(doors);
	var mydoors=JSON.stringify(doors);
	var syncdata=cron_mod.save_gg_doors_in_server(mydoors,'');
	syncdata.then(res=>{
	//  console.log(res);
	});
	});
}
function gallagher_card_types()
{
	var access_types=cron_mod.get_gallagher_card_types();
	access_types.then(types=>{
		var mycardtypes=JSON.stringify(types);
		var syncdata=cron_mod.save_gg_card_types_in_server(mycardtypes);
	syncdata.then(res=>{
	// console.log(res);
	});
	});
}
function gallagher_access_divisions(){
	var divisions=cron_mod.get_gallagher_divisions();
	divisions.then(groups=>{
		var mydivisions=JSON.stringify(groups);
	var syncdata=cron_mod.save_gg_divisions_in_server(mydivisions,'');
	syncdata.then(res=>{
	//  console.log(res);
	});
	});
}

//**************FR CONFIG**************** */
FR_config();
function FR_config()
{
		fr_access_divisions();
		fr_access_groups();
		fr_access_doors();
		fr_vehicle_groups();
		// asyncCall_for_camera_listing();
}
function fr_access_divisions(){
	var orginazations=cron_mod.get_fr_organizations();
	orginazations.then(groups=>{
		var myorgs=JSON.stringify(groups);	
	var syncdata=cron_mod.save_fr_org_in_server(myorgs);
	syncdata.then(res=>{
	//   console.log(res);
	});
	});
}
function fr_access_groups()
{
	
	var frgroups=cron_mod.get_fr_groups();
	frgroups.then(groups=>{
		var myfrgroups=JSON.stringify(groups);
	var syncdata=cron_mod.save_fr_group_in_server(myfrgroups);
	syncdata.then(res=>{ 
	});
	});
}

function fr_access_doors()
{
	var dor=cron_mod.get_fr_doors();
	dor.then(groups=>{	
		var frdoors=JSON.stringify(groups);	
	var syncdata=cron_mod.save_fr_doors_in_server(frdoors);
	syncdata.then(res=>{ 
	});
	});
}
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
  
// async function asyncCall_for_camera_listing() {
	
// 	const cameras = await get_camera_listings();

// 	for (var i = cameras.length - 1; i >= 0; i--) {

// 		var cameraIndexCode = cameras[i].cameraIndexCode;
// 		cameras[i].image = await get_camera_thumbnail(cameraIndexCode);
// 		cameras[i].port = 9999-1;
		
// 	}
	
// 	//console.log(cameras);
// 	cam_data=JSON.stringify(cameras);
	
	
// 	var syncdata=cron_mod.save_cameras_in_server(cam_data);
// 	syncdata.then(res=>{
// 		//console.log(res);
// 	});
	
// }
function fr_vehicle_groups()
{
	var frvehicle=cron_mod.get_fr_vehicle_groups();
frvehicle.then(groups=>{
	
	var vehgroup=JSON.stringify(groups);
	
	cron_mod.save_fr_vehicle_group_in_server(vehgroup);
});
}
//============BIO START CONFIGS===============
// BS_config();
// function BS_config()
//     {
// 		bs_access_devices();
// 		bs_access_user_groups();
// 		bs_access_groups();
// 		bs_access_levels();
// 		bs_access_doors();
// 	}

function bs_access_devices(){
		if(mylogin){
		var devices_res=cron_mod.get_bs_scan_devices(mylogin);
		devices_res.then(getdevices=>{
		if(getdevices==2){
		var bs_scan=cron_mod.Login_into_device();
		bs_scan.then(login=>{
		if(login)
		{
		mylogin=login;
		}else{
		mylogin=false;
		}
		});
		}
		else if(getdevices==3){

		}else{
		var syncdata=cron_mod.save_bs_scan_devices_in_server(getdevices);
		syncdata.then(res=>{
		// console.log(res);
		});
		}
		});
		}else{

		var bs_scan=cron_mod.Login_into_device();
		bs_scan.then(login=>{
			if(login)
			{
				mylogin=login;
				bs_access_devices();
			}else{
				mylogin=false;
			}
		});
		}
}
function bs_access_user_groups()
{
	if(mylogin)
	{
				var devices_res=cron_mod.get_bs_user_groups(mylogin);
				devices_res.then(getdevices=>{
				if(getdevices==2)
				{
						var bs_scan=cron_mod.Login_into_device();
						bs_scan.then(login=>{
						if(login)
						{
						mylogin=login;
						}else{
						mylogin=false;
						}
						});
				}
				else if(getdevices==3)
				{
	
				}else
				{
				var syncdata=cron_mod.save_bs_user_groups_in_server(getdevices);
				syncdata.then(res=>{
				//	 console.log(res);
				});
				}
				});
	}else{
						var bs_scan=cron_mod.Login_into_device();
						bs_scan.then(login=>{
						if(login)
						{
						mylogin=login;
						bs_access_user_groups()
						}else{
						mylogin=false;
						}
						});
	}
}
function bs_access_groups()
{
	if(mylogin)
	{
		
				var devices_res=cron_mod.get_bs_access_groups(mylogin);
			
				devices_res.then(getdevices=>{
				
				if(getdevices){
				
				var syncdata=cron_mod.save_bs_access_groups_in_server(getdevices);
				syncdata.then(res=>{
				//	 console.log(res);
				});
				
			}
				});
	}else{
						var bs_scan=cron_mod.Login_into_device();
						bs_scan.then(login=>{
						if(login)
						{
						mylogin=login;
						bs_access_groups();
						}else{
						mylogin=false;
						}
						});
	}
}
function bs_access_levels()
{
	if(mylogin)
	{
				var devices_res=cron_mod.get_bs_access_levels(mylogin);
				devices_res.then(getdevices=>{
				
				if(getdevices)
				{
				var syncdata=cron_mod.save_bs_access_levels_in_server(getdevices);
				syncdata.then(res=>{
				//	 console.log(res);
				});
				}
				});
	}else{
						var bs_scan=cron_mod.Login_into_device();
						bs_scan.then(login=>{
						if(login)
						{
						mylogin=login;
						bs_access_levels();
						}else{
						mylogin=false;
						}
						});
	}
}
function bs_access_doors()
{
	if(mylogin)
	{
	
				var devices_res=cron_mod.get_bs_access_doors(mylogin);
				devices_res.then(getdevices=>{
					//console.log(getdevices);
				if(getdevices)
	
				{
				var syncdata=cron_mod.save_bs_access_doors_in_server(getdevices);
				syncdata.then(res=>{
					// console.log(res);
				});
				}
				});
	}else{
						var bs_scan=cron_mod.Login_into_device();
						bs_scan.then(login=>{
						if(login)
						{
						mylogin=login;
						bs_access_doors();
						}else{
						mylogin=false;
						}
						});
	}
}
//=====================================================
// function bs_access_finger_events(){
// 	if(mylogin){
// 	var devices_res=cron_mod.get_bs_finger_events(mylogin);
// 	devices_res.then(getdevices=>{
	
// 	if(getdevices){
// 		var fingerevents=JSON.stringify(getdevices);
// 	//	console.log(fingerevents);
// 	var syncdata=cron_mod.save_bs_save_finger_print_data(fingerevents);
// 	syncdata.then(res=>{
// 	// console.log(res);
	
// 	});
// }

// });
// 	}else{

// 	// var bs_scan=cron_mod.Login_into_device();
// 	// bs_scan.then(login=>{
// 	// 	if(login)
// 	// 	{
// 	// 		mylogin=login;
// 	// 		bs_access_finger_events();
// 	// 	}else{
// 	// 		mylogin=false;
// 	// 	}
// 	// });
// 	}
// }     
//====================================================
//===============END EVENTS ONLY ONE TIME==========
//======================================================
function run_cron_for_gallagher_events(){
	var gg_status=-1;
	var fr_status=-1;
	var bs_status=-1;
	var intervaly = setInterval(function() 
	{
	var checkin_events;
	var doors_events;
	cron_mod.check_event_trigger_or_not();
	//cron_mod.trigger_events_add_modify();
	
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
// 	var dooeevent=cron_mod.get_gallagher_door_alarms();
// 	dooeevent.then(groups=>{
// 		if(groups.length>0){
// 			doors_events=JSON.stringify(groups);
// 		//	console.log(doors_events);
// 	var syncdata=cron_mod.save_gg_ndoor_alarms_events_in_server(doors_events);
// 	syncdata.then(res=>{
// //console.log(res);
// 	});
// 		}
// 	});
	//=============BIOSTAR EVENTS============
// 	if(mylogin){
// 	var bioevents=cron_mod.get_biostar_events_alarms(mylogin);
// 	bioevents.then(groups=>{
// 		if(groups.length>0){
// 			var doors_events=JSON.stringify(groups);
// 			console.log(doors_events);
// 	var syncdata=cron_mod.save_bs_ndoor_alarms_events_in_server(doors_events);
// 	syncdata.then(res=>{

// 	});
// 		}
// 	});
// }
//=======================checking device statuses==============
// var gg_checking=cron_mod.check_gallagher_device_status();
// gg_checking.then(res=>{
	
// 	if(gg_status!=res){

// 		gg_status=res;
// 		console.log("UPDATED GG STATUS");
//    cron_mod.save_device_statuses(res,'GG');
//    cron_mod.update_device_statuses_into_db(res,'GG');
// 	}
   
// })

// 	var ff_checkings=cron_mod.check_fr_device_status();
// 	ff_checkings.then(res=>{
// 		if(fr_status!=res){
// 			fr_status=res;
// 			console.log("UPDATED FR STATUS");
// 	   cron_mod.save_device_statuses(res,'FR');
// 	   cron_mod.update_device_statuses_into_db(res,'FR');
// 		}
	   
//    })	 					


// 	var bschecking=cron_mod.check_biostar_device_status();
// 	bschecking.then(res=>{
// 		if(bs_status!=res){
// 			bs_status=res;
// 			console.log("UPDATED BS STATUS");
// 	   cron_mod.save_device_statuses(res,'BS');
// 		}
//    }) 					



//=============================================================

// bs_access_finger_events();
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
// function run_cron_for_gallagher_add_user(){
// 	var intervalz = setInterval(function() 
// 	{
// 	var add_user_events;
// 	var add_user=cron_mod.check_gallagher_add_cardholder_events();
// 	add_user.then(groups=>{
// 		if(groups.length>0){
// 	add_user_events=JSON.stringify(groups);
// 	var syncdata=cron_mod.save_gg_cardholders_on_server(add_user_events);
// 	syncdata.then(res=>{
//    console.log(res);
// 	});
	 
// 		}
// 	});	
	
	
// 	  }, constants.DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME);
	
// }
// function run_cron_for_fr_add_user(){
// 	var intervalz = setInterval(function() 
// 	{
// 	var add_user_events;
// 	var add_user=cron_mod.check_fr_add_users_events();
// 	add_user.then(groups=>{
// 		if(groups.length>0){
// 	add_user_events=JSON.stringify(groups);

// 	var syncdata=cron_mod.save_fr_users_on_server(add_user_events);
// 	syncdata.then(res=>{
//    console.log(res);
// 	});
	 
// 		}
// 	});	
	
	
// 	  }, constants.DEFAULT_ADD_FR_USER_EVENT_CRON_TIME);
	
// }
function run_cron_for_fr_event_subscription(){
	var face_thermal_events = setInterval(function() 
	{

	var sbscription=cron_mod.check_fr_get_event_subscription();
	sbscription.then(groups=>{
		console.log(groups);
		if(groups==-1){
		// var data={eventDest: constants.FR_SUBSCRIPTION+'/mqtt_client/fr_transactions',
		// 		eventTypes: [constants.FR_FACE_EVENT_CODE]
		// 	}

		var data='{"eventDest":"'+constants.FR_SUBSCRIPTION+'/mqtt_client/fr_transactions","eventTypes":['+constants.FR_FACE_EVENT_CODE+']}';
		var thermal_event=cron_mod.save_fr_get_event_subscription(data);
		thermal_event.then(face_resp=>{
			if(face_resp){
		var data='{"eventDest":"'+constants.FR_SUBSCRIPTION+'/mqtt_client/fr_faces_transactions","eventTypes":['+constants.FR_THERMAL_CAMERA_EVENT_CODE+']}';
		var face_event=cron_mod.save_fr_get_event_subscription(data);
		thermal_event.then(thermal_resp=>{
			if(thermal_resp){
	var data='{"eventDest":"'+constants.FR_SUBSCRIPTION+'/mqtt_client/fr_camera_events","eventTypes":['+constants.FR_MOTION_DETECTION_CAMERA_CODE+']}';
		var face_event=cron_mod.save_fr_get_event_subscription(data);
		thermal_event.then(cameraevents=>{
			if(cameraevents){
				console.log("Events Successfully Subscribed");
		clearInterval(face_thermal_events); 
			}
		});
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
 	////////////////////OPEN THE DDOR//////////////////////////
	 if(req_method == 'get_devices_config'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
		 
			if(data_obj['code']=="GG"){		
			   	GG_config();
					client.publish(msgtopic, JSON.stringify(true), { qos: 1, response: false })
			}else if(data_obj['code']=="FR"){		
				FR_config();
				 client.publish(msgtopic, JSON.stringify(true), { qos: 1, response: false })
			 }
			 else if(data_obj['code']=="BS"){		
				//BS_config();
				 client.publish(msgtopic, JSON.stringify(true), { qos: 1, response: false })
			   }
			   else{
				client.publish(msgtopic, JSON.stringify(false), { qos: 1, response: false })  
			   }
			

	 }		 
		///////////////////////////////////////////////////////////////////
 

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
		 var vehicles = data_obj['FR']['vehicles'];
		 var card_number = data_obj['FR']['cards'][0];
	     console.log(vehicles);				
		 var face_id = fr_mod.add_fr_user(personal_info,card_number,data_obj['personal']['org'])
		 face_id.then(facerep=>{
			var gg = facerep[0]['FR']['person_id'];
			if(gg!=0){
var vehicle_array=[];
			if(vehicles)
			{
				for(var i=0;i<vehicles.length;i++)
				{
					var plate_no=vehicles[i]['plate_no'];
				var vehl = fr_mod.add_person_vehicle(gg,vehicles[i]['plate_no'],vehicles[i]['group_id'])
				vehl.then(vehcle=>{
					if(vehcle!=3)
					{
						var newobj={
							'plate_no':vehcle.plate_no,
							'vehicle_id':vehcle.vehicle_id
						}
					
						vehicle_array.push(newobj);
					}
				});
			}
			var intervalxxx = setInterval(function() {

				clearInterval(intervalxxx);
			if(vehicle_array){
			
			var objss={"FR":{"person_id":gg,"message":"success", 'vehicles':vehicle_array}}
				
			client.publish(msgtopic, JSON.stringify(objss), { qos: 1, response: false })
			}else{
				var objss={"FR":{"person_id":gg,"message":"success", 'vehicles':''}}
				client.publish(msgtopic, JSON.stringify(objss), { qos: 1, response: false })	
				
				
			}
		}, 1200);
			}else{
				var objss={"FR":{"person_id":gg,"message":"success", 'vehicles':''}}
				client.publish(msgtopic, JSON.stringify(objss), { qos: 1, response: false })	
			}
			
		}else{
			var objss={"FR":{"person_id":0,"message":"failed", 'vehicles':''}}
			client.publish(msgtopic, JSON.stringify(objss), { qos: 1, response: false })	
		}

	 
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
	//  if(req_method == 'add_bs_users'){
	// 	if(mylogin){
	// 	var msgcontent = 'BIOSTAR Data Recieved';
		
	// 	 var data_obj = JSON.parse( msg_arr[1] ); 
	// 	 var personal_info = data_obj['personal'];
		
	// 	 if(data_obj['personal']['tag']=="Add")
	// 	 {
	// 		var finger_prints = data_obj['BS']['finger_prints'];
	// 		var lift_id = BIOSTART.add_user_in_biostart(mylogin ,personal_info,finger_prints)
	// 	 }else{
	// 	console.log("UPDATED");
	// 		var lift_id = BIOSTART.update_user_in_biostart(mylogin ,personal_info)
	// 	 }
		
	// 	 lift_id.then( liftrep => {
			 
	// 		var gg = liftrep[0]['BS']['person_id'];
	// 		console.log("USER_BS="+gg);
	// 	client.publish(msgtopic, JSON.stringify(liftrep[0]), { qos: 1, response: false })
			 
	// 	 });
	// 	}else{
    //           console.log("NOT LOGIN IN BS");      
	// 	}				
	//  }
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
		console.log("PERSON_ID"+fr_person_id);
		var vehicles = data_obj['FR']['vehicles'];
		if(vehicles.length>0)
		{
			for(var k=0;k<vehicles.length;k++)
			{
                   fr_mod.delete_person_vehicle(vehicles[k]);
			}
		}			
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
	//  if(req_method == 'delete_bs_users'){
	// 	if(mylogin){
	// 	var msgcontent = 'Data Recieved';
	// 	 var data_obj = JSON.parse( msg_arr[1] ); 
	// 	 var person_id_bs = data_obj['BS']['person_id'];
	// 	 var lift_id = BIOSTART.delete_user_from_biostar(mylogin,person_id_bs)
	// 	 lift_id.then( liftrep => {	 	
	// 		console.log("DELETED_USER_BS="+person_id_bs);
	// 	client.publish(msgtopic, JSON.stringify(liftrep), { qos: 1, response: false })	 
	// 	 });	
	// 	}else{
	// 		console.log("NO LOGIN");
	// 	}			
	//  }
	////////////////////update cards to devices////////////////////////
	if(req_method == 'update_gg_users'){
		var msgcontent = 'Data Recieved';
		var data_obj = JSON.parse( msg_arr[1] ); 
		var gg_person_id = data_obj['GG']['person_id'];
		var gg_cards = data_obj['GG']['cards'];
			var cardholder_id = gr_mod.update_card_status(data_obj['GG']['firstname'],data_obj['GG']['lastname'],data_obj['GG']['photo'],gg_person_id,gg_cards)
		try{
			cardholder_id.then(gala_resp=>{				
				if(gala_resp){
					console.log("GG EXPIRY UPDATED");	
			 client.publish(msgtopic, JSON.stringify(gala_resp), { qos: 1, response: false })
				}else{
					console.log("GG EXPIRY FAILED TO UPDATE");
			client.publish(msgtopic, JSON.stringify(gala_resp), { qos: 1, response: false })
				}	
			});	
		}catch(error)
		{
			console.log("GG EXPIRY FAILED TO UPDATE");	
			client.publish(msgtopic, JSON.stringify(false), { qos: 1, response: false })
		}
	 }
	 if(req_method == 'update_fr_users'){
		var data_obj = JSON.parse( msg_arr[1] );
		var fr_person_id = data_obj['FR']['person_id'];
		var fr_cards = data_obj['FR']['cards'];
		var face_id = fr_mod.add_update_fr_card(data_obj['FR']['firstname'],data_obj['FR']['lastname'],data_obj['FR']['photo'],fr_person_id,fr_cards[0])
		try{
		face_id.then(face_resp=>{		

			if(face_resp){
				console.log("FR EXPIRY UPDATED");
			client.publish(msgtopic, JSON.stringify(face_resp), { qos: 1, response: false })
			}else{
				console.log("FR EXPIRY FAILED TO UPDATE");
			client.publish(msgtopic, JSON.stringify(face_resp), { qos: 1, response: false })
			}

			});
		}catch(error)
		{
			console.log("FR EXPIRY FAILED TO UPDATE");
			client.publish(msgtopic, JSON.stringify(false), { qos: 1, response: false })	
		}
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
						else if(data_obj['BS']){
							var lft_id = BIOSTART.delete_user_from_biostar(mylogin,data_obj['BS']['user_id'])	
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
	 ////////////////////ACknowledge Alarm//////////////////////////
	if(req_method == 'acknowledge_alarm'){
		var msgcontent = 'Data Recieved';
		 var data_obj = JSON.parse( msg_arr[1] ); 
			if(data_obj['GG']){		
			var alarm_rec = gr_mod.acknowledge_alarm_by_id(data_obj['GG']['alarm_id'])
			alarm_rec.then(gala_resp=>{				
			client.publish(msgtopic, JSON.stringify(gala_resp), { qos: 1, response: false })
			});
			}
	 }
	 //================ANPR============================
	 if(req_method == 'delete_vehicle_access'){
		
		var data_obj = JSON.parse( msg_arr[1] ); 
        var vehicle_id = data_obj['vehicle_id'];		
		var face_id = fr_mod.delete_person_vehicle(vehicle_id)
		face_id.then(facerep=>{
		  if(facerep==1)
		  {
			  console.log("Vehicle DELETED");
			client.publish(msgtopic, JSON.stringify(true), { qos: 1, response: false })	 
		  }else{
			client.publish(msgtopic, JSON.stringify(false), { qos: 1, response: false })	 
		  }
	  
		});
	 }
	 if(req_method == 'add_vehicle_access'){
		
		var data_obj = JSON.parse( msg_arr[1] ); 
		var person_id = data_obj['FR']['person_id'];
		var vehicles = data_obj['FR']['vehicles'];
		var vehicle_array=[];
		if(vehicles)
		{
			for(var i=0;i<vehicles.length;i++)
			{
			
			var vehl = fr_mod.add_person_vehicle(person_id,vehicles[i]['plate_no'],vehicles[i]['group_id'])
			vehl.then(vehcle=>{
				if(vehcle!=3)
				{
					var newobj={
						'plate_no':vehcle.plate_no,
						'vehicle_id':vehcle.vehicle_id
					}
				
					vehicle_array.push(newobj);
				}
			});
		}
	}
	var intervalxxx = setInterval(function() {

		clearInterval(intervalxxx);
	if(vehicle_array){
	var objss={"FR":{"person_id":person_id,"message":"success", 'vehicles':vehicle_array}}
	client.publish(msgtopic, JSON.stringify(objss), { qos: 1, response: false })
	}else{
		var objss={"FR":{"person_id":person_id,"message":"failed", 'vehicles':''}}
		client.publish(msgtopic, JSON.stringify(objss), { qos: 1, response: false })
	}
}, 1200);


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
  //==========================BIO STAR======================
//   if(req_method=="scan_finger")
//   {
// 	var msgcontent = 'Data Recieved';
// 	var data_obj = JSON.parse( msg_arr[1] ); 
// 	var device_id = data_obj['device_id'];
// 	if(mylogin)
// 	{
// 		//console.log("SUCCESSFULLY LOGIN");
// 		var devices_res=BIOSTART.get_bs_scan_finger(mylogin,device_id);
// 		devices_res.then(getdevices=>{
			
// 		if(getdevices==2)
// 		{
// 			var bs_scan=cron_mod.Login_into_device();
// 			bs_scan.then(login=>{
// 				if(login)
// 				{
// 					mylogin=login;
// 					var devices_res=BIOSTART.get_bs_scan_finger(mylogin,541618936);
// 					devices_res.then(resp=>{
// 						client.publish(msgtopic, JSON.stringify(resp), { qos: 1, response: false })
// 					})
// 				}else{
// 					mylogin=false;
// 				}
// 			});
// 		}else{
// 			client.publish(msgtopic, JSON.stringify(getdevices), { qos: 1, response: false })
// 		}
// 		});
// 	}else{
// 		var bs_scan=cron_mod.Login_into_device();
// 		bs_scan.then(login=>{
// 			if(login)
// 			{
// 				mylogin=login;
// 				var devices_res=BIOSTART.get_bs_scan_finger(mylogin,541618936);
// 				devices_res.then(resp=>{
// 					client.publish(msgtopic, JSON.stringify(resp), { qos: 1, response: false })
// 				})
// 			}else{
// 				mylogin=false;
// 			}
// 		});
// 	}

//   }
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