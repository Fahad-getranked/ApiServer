// you need to install ffmpeg on windows from https://ffmpeg.org/download.html
var express = require('express');
Stream = require('node-rtsp-stream');
var axios = require('axios');
var qs = require('qs');
const shellExec = require('shell-exec');
var constants=require("../constants.js");



var stream_server = function(cameraIndexCode,streamport,cameraname){

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

	axios(config).then(function (response) {

		var streamurl = response.data.data.url;

		stream = new Stream({
		  name: cameraname,
		  streamUrl: streamurl,
		  wsPort: streamport,
		  ffmpegOptions: { // options ffmpeg flags
		    '-stats': '', // an option with no neccessary value uses a blank string
		    '-r': 30, // options with required values specify the value after the key
		    '-frames':1,
			'-ss': 30 ,
			'-loglevel' : 'quiet'
		  }
		})

	}).catch(function (error) {
		console.log(error);
	});
	
}

module.exports = stream_server;


