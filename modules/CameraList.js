var express = require('express');
var axios = require('axios');
var qs = require('qs');
var constants=require("../constants.js");

exports.get_camera_listing = function (){

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
				'BodyParameters': '{   "pageNo": 1,   "pageSize": 100,   "siteIndexCode": "0" }' 
			});
			var config = {
				method: 'post',
				url: url,
				headers: { 
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data : data
			};

			axios(config).then(function (response) {
				resolve(response.data.data.list);	
			}).catch(function (error) {
				console.log(error);
			});

		}catch(error)
		{
			console.log(error);
		}
	});
}
