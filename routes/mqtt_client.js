const express= require("express");
var axios = require('axios');
var qs = require('qs');
var mqtt = require('mqtt');
var fr_mod = require('../modules/fr_module');
var gr_mod = require('../modules/gallagher_module');
var lift_mod = require('../modules/lift_module');

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
//console.log('date => '+ fr_mod.add_fr_user('fahad12444443','rasheed144423','description','2','https://skacomm.skais.com.my/community/get_user_image_mqtt/1','34232423423'));
//console.log(get_user_image('https://skacomm.skais.com.my/community/get_user_image_mqtt/1'));


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
	
	//console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
	var msg = message.toString();
	var msg_arr = msg.split('***||***');
	var msgtopic = msg_arr[0];
	var msgcontent = 'Data Recieved';
	var data_obj = JSON.parse( msg_arr[1] );


	var cardholder_id = gr_mod.save_user_in_gallagher(data_obj['firstName'],data_obj['lastName'],data_obj['description'],data_obj['division'],data_obj['picture'],data_obj['card_no'],data_obj['card_type'])

	cardholder_id.then(restt=>{
		gala=restt;
		var face_id = fr_mod.add_fr_user(data_obj['firstName'],data_obj['lastName'],data_obj['description'],data_obj['division'],data_obj['picture'],data_obj['card_no'],data_obj['card_type'])
		
		face_id.then(facerep=>{
			// face=0;
			var lift_id = lift_mod.add_lift_user(data_obj['firstName'],data_obj['lastName'],gala)
			
			lift_id.then( liftrep => {
				lifts=liftrep;
							var obj={
									'cardholder_id':gala,
									'face_id':face,
									'lift_id':lifts
							};
			
				client.publish(msgtopic, JSON.stringify(obj), { qos: 1, response: false })
			});

		});
	});


		
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