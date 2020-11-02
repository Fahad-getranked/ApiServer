const express= require("express");
var axios = require('axios');
var qs = require('qs');
var mqtt = require('mqtt');
var sf = require('sf');
var fr_mod = require('../modules/fr_module');
var gr_mod = require('../modules/gallagher_module');
var lift_mod = require('../modules/lift_module');
var cron_mod = require('../modules/cron_module');



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
//run_cron_for_gallagher();
function run_cron_for_gallagher(){
var interval = setInterval(function() {
var mygroups;
var myzones;
var mydoors;
var mycardtypes;
var access_groups=cron_mod.get_gallagher_access_groups();
access_groups.then(groups=>{
	
mygroups=JSON.stringify(groups);
var syncdata=cron_mod.save_gg_access_groups_in_server(mygroups);
syncdata.then(res=>{
// console.log(res);
});
});
var access_zones=cron_mod.get_gallagher_zones();
access_zones.then(zones=>{
	myzones=JSON.stringify(zones);
	var syncdata=cron_mod.save_gg_access_zones_in_server(myzones);
syncdata.then(res=>{
//console.log(res);
});
});
var access_doors=cron_mod.get_gallagher_doors();
access_doors.then(doors=>{
// console.log(doors);
mydoors=JSON.stringify(doors);
var syncdata=cron_mod.save_gg_doors_in_server(mydoors);
syncdata.then(res=>{
// console.log(res);
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
	

  }, 20000);

}
//=============================================================
var personal_info={
	firstname:"ALI",
	lastname:"HASSAN",
	division:2,
	photo:"https://skacomm.skais.com.my/community/get_user_image_mqtt/1",
	email:"fahad@getranked.com.my",
	phone:"3165465464"

}
var access_groups="9926,6546";
var cardtypes=[];
cardtypes.push(
	{
		card_type:334,
		card_number:"236965369",
		valid_from:"2020-10-28 00:00:00",
		valid_to:"2021-10-28 00:00:00",
		card_external_id:"428a311b020c4d0886755a826c6971d9",
        status:"Damaged"
	}
);
// gr_mod.update_card_status(375244,cardtypes).then(res=>{
// 	console.log(res);
// })

var clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
var host = 'ws://altitudeprojects.net:8883'
var options = {
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
	username:'syslab',
	password:'mqtt@syslab'
}

console.log('connecting mqtt client')
var client = mqtt.connect(host, options)
client.on('error', function (err) {
	console.log(err)
	client.end()
})



client.on('connect', function () {
	console.log('client connected:' + clientId)
	console.log('client connected:' + host)
	client.subscribe('live_request', { qos: 1 })

})

client.on('message', function (topic, message, packet) {
	
	var result_array=[];
	var msg = message.toString();
	
	var msg_arr = msg.split('***||***');
	
	var msgtopic = msg_arr[0];
	var req_method = msg_arr[2];

	////////////////////add cards to devices///////////////////////////
	if(req_method === 'add_profile'){
		result_array=[];
		var msgcontent = 'Data Recieved';
		var data_obj = JSON.parse( msg_arr[1] ); 
		var personal_info = data_obj['personal']; 

		if(typeof data_obj['GG'] !== 'undefined') {

			var groups = JSON.stringify(data_obj['GG']['groups'].join(",") );
			var cardtypes = data_obj['GG']['cards'];

			var cardholder_id = gr_mod.save_user_in_gallagher(personal_info,cardtypes,access_groups)

			cardholder_id.then(gala_resp=>{		
				
					
					var galaghar_id = gala_resp[0]['GG']['person_id'];
				console.log("LiftID="+galaghar_id);
						result_array.push(gala_resp[0]);
						
						

						if(typeof data_obj['FR'] !== 'undefined') {

							var card_number = data_obj['FR']['cards'][0]['card_number'];
							
							var face_id = fr_mod.add_fr_user(personal_info,card_number)
							face_id.then(facerep=>{
							
								result_array.push(facerep[0]);
								
							});

						}
						if(typeof data_obj['SL'] !== 'undefined') {

							var lift_groups = JSON.stringify(data_obj['SL']['groups'].join(",") );
							var lift_id = lift_mod.add_lift_user(personal_info,galaghar_id,lift_groups)
							lift_id.then( liftrep => {
								
								result_array.push(liftrep[0]);
								
							});
						
					
						}
			var interval = setInterval(function() {	
				if(result_array!="" && result_array!=undefined)
				{		
			clearInterval(interval);
			
			client.publish(msgtopic, JSON.stringify(result_array), { qos: 1, response: false })	
				}
					}, 9000);
			

			});
		

		}
	}
	///////////////////////////////////////////////////////////////////
	
	////////////////////delete profile to devices////////////////////////
	if(req_method == 'delete_profile'){
		result_array=[];
		var msgcontent = 'Data Recieved';
		
		var data_obj = JSON.parse( msg_arr[1] ); 

		
		if(typeof data_obj['GG'] !== 'undefined') {

			
			var gg_person_id = data_obj['GG']['person_id'];

			var cardholder_id = gr_mod.delete_cardholder_details(gg_person_id)

			cardholder_id.then(gala_resp=>{		
				
				if(gala_resp){
					result_array.push(1);
				}else{
					result_array.push(0);
				}
				
				
				if(typeof data_obj['FR'] !== 'undefined') {

					var fr_person_id = data_obj['FR']['person_id'];
					
					var face_id = fr_mod.delete_fr_user(fr_person_id)
					face_id.then(facerep=>{
					
						if(facerep ){
							result_array.push(1);
						}else{
							result_array.push(0);
						}
					});

				}
				if(typeof data_obj['SL'] !== 'undefined') {

					var lift_person_id = data_obj['SL']['person_id'];
					var lift_id = lift_mod.delete_lift_user(lift_person_id)
					lift_id.then( liftrep => {
					
						if(liftrep ){
							result_array.push(1);
						}else{
							result_array.push(0);
						}
						
					});
				
			
				}
				
				var interval = setInterval(function() {	
					if(result_array!="" && result_array!=undefined)
					{		
						clearInterval(interval);
							
						client.publish(msgtopic, JSON.stringify(result_array), { qos: 1, response: false })	
					}
				}, 2000);
			

			});
		

		}
	}
	///////////////////////////////////////////////////////////////////

	////////////////////delete cards to devices////////////////////////
	if(req_method == 'delete_card'){
		result_array=[];
		var msgcontent = 'Data Recieved';
		
		var data_obj = JSON.parse( msg_arr[1] ); 

		console.log(data_obj);
		
		if(typeof data_obj['GG'] !== 'undefined') {
			
			var gg_person_id = data_obj['GG']['person_id'];
			var gg_card_id = data_obj['GG']['card_id'];

			var cardholder_id = gr_mod.delete_card_details(gg_person_id,gg_card_id)

			cardholder_id.then(gala_resp=>{		
				
				if(gala_resp){
					result_array.push(1);
				}else{
					result_array.push(0);
				}
				console.log(gala_resp);
			});
			
		}

		if(typeof data_obj['FR'] !== 'undefined') {

			var fr_card_holder_id = data_obj['FR']['person_id'];
			
			var face_id = fr_mod.delete_fr_card(fr_card_holder_id)
			face_id.then(facerep=>{
				console.log(facerep);
				if(facerep ){
					result_array.push(1);
				}else{
					result_array.push(0);
				}
			});

		}

		var interval = setInterval(function() {	
			if(result_array!="" && result_array!=undefined)
			{		
				clearInterval(interval);
				console.log(JSON.stringify(result_array));		
				client.publish(msgtopic, JSON.stringify(result_array), { qos: 1, response: false })	
			}
		}, 1000);
	}
	///////////////////////////////////////////////////////////////////

	////////////////////delete cards to devices////////////////////////
	if(req_method == 'update_card'){
		result_array=[];
		var msgcontent = 'Data Recieved';
		
		var data_obj = JSON.parse( msg_arr[1] ); 

		
		
		if(typeof data_obj['GG'] !== 'undefined') {
			
			var gg_person_id = data_obj['GG']['person_id'];
			var gg_cards = data_obj['GG']['cards'];
			var gg_card_detail = [];
		

				var cardholder_id = gr_mod.update_card_status(gg_person_id,gg_cards)

				cardholder_id.then(gala_resp=>{		
					
					if(gala_resp){
						result_array.push(1);
					}else{
						result_array.push(0);
					}
					
				});

		

			
			
		}

		if(typeof data_obj['FR'] !== 'undefined') {
			
			var fr_person_id = data_obj['FR']['person_id'];
			var fr_cards = data_obj['FR']['cards'];
			var fr_card_detail = [];
			for(var i=0;i<fr_cards.length;i++){
			if(fr_cards[i]['status']!='Active')
			{
					var face_id = fr_mod.delete_fr_card(fr_person_id)

								face_id.then(face_resp=>{		
									
									if(face_resp){
										result_array.push(1);
									}else{
										result_array.push(0);
									}
									
								});
						}else{
							var face_id = fr_mod.add_update_fr_card(fr_person_id,fr_cards[i])

							face_id.then(face_resp=>{		
								
								if(face_resp){
									result_array.push(1);
								}else{
									result_array.push(0);
								}
							
							});
					}
			

				
			}

			
			
		}
		// if(typeof data_obj['SL'] !== 'undefined') {
			
		// 	var sl_person_id = data_obj['SL']['person_id'];
		// 	var sl_cards = data_obj['SL']['cards'];
		// 	for(var i=0;i<sl_cards.length;i++){
	
		// 			var face_id = fr_mod.delete_fr_card(fr_person_id)

		// 						face_id.then(face_resp=>{		
									
		// 							if(face_resp){
		// 								result_array.push(1);
		// 							}else{
		// 								result_array.push(0);
		// 							}
		// 							console.log(face_resp);
		// 						});
		
		// 	}

			
			
		// }
		var interval = setInterval(function() {	
			if(result_array!="" && result_array!=undefined)
			{		
				clearInterval(interval);
				console.log(JSON.stringify(result_array));		
				client.publish(msgtopic, JSON.stringify(result_array), { qos: 1, response: false })	
			}
		}, 1000);
	}
	///////////////////////////////////////////////////////////////////
		
})

client.on('close', function () {
  	console.log(clientId + ' disconnected')
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