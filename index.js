const express= require("express");
const https=require("https");
const path=require("path");
const fs=require("fs");
var constants=require("./constants.js");
const app=express();
app.use(express.json());
const lineReader = require('line-reader');

//=========================CONFIG READING============
//===================================================
console.log(__dirname);
lineReader.eachLine('../config.txt', function(line) {
    var lineitem=line.split('=');
    // console.log(lineitem[0]+"--------------"+lineitem[1]);
    var tag=lineitem[0].trim();
    if(tag=='GALLAGHER_KEY')
    {
        var value=lineitem[1].trim();
      
        global.GALLAGHER_KEY = value;
       console.log( global.GALLAGHER_KEY);
        
       
    }else if(tag=='GALLAGHER_HOST')
    {
        var value=lineitem[1].trim();
      
        global.GALLAGHER_HOST =value;
        
        
       
    }
    else if(tag=='CODE')
    {
        var value=lineitem[1].trim();
      
        global.CODE =value;
        
        
       
    }
    else if(tag=='FR_HOST')
    {
        var value=lineitem[1].trim();
      
        global.FR_HOST =value;
        
        
       
    }
    else if(tag=='FR_SECRET_KEY')
    {
        var value=lineitem[1].trim();
      
        global.FR_SECRET_KEY =value;
        
        
       
    }
    else if(tag=='FR_LOCAL_IP')
    {
        var value=lineitem[1].trim();
      
        global.FR_LOCAL_IP =value;
        
        
       
    }
    else if(tag=='FR_LOCAL_IP')
    {
        var value=lineitem[1].trim();
      
        global.FR_LOCAL_IP =value;
        
        
       
    }
    else if(tag=='FR_PORT')
    {
        var value=lineitem[1].trim();
      
        global.FR_PORT =value;
        
        
       
    }
    else if(tag=='FR_PROTOCOL')
    {
        var value=lineitem[1].trim();
      
        global.FR_PROTOCOL =value;
        
        
       
    }
    else if(tag=='LIFT_HOST')
    {
        var value=lineitem[1].trim();
      
        global.LIFT_HOST =value;
        
        
       
    }
    else if(tag=='LOGIN_LIFT_USER')
    {
        var value=lineitem[1].trim();
      
        global.LOGIN_LIFT_USER =value;
        
        
       
    }
    else if(tag=='LOGIN_LIFT_PASSWORD')
    {
        var value=lineitem[1].trim();
      
        global.LOGIN_LIFT_PASSWORD =value;
        
        
       
    }
    else if(tag=='BASE_SERVER_URL')
    {
        var value=lineitem[1].trim();
      
        global.BASE_SERVER_URL =value;
        
        
       
    }
    else if(tag=='DEFAUL_EVENT_SECONDS')
    {
        var value=lineitem[1].trim();
      
        global.DEFAUL_EVENT_SECONDS =value;
        
        
       
    }
    else if(tag=='DEFAULT_EVENT_CRON_JOB_TIME')
    {
        var value=lineitem[1].trim();
      
        global.DEFAULT_EVENT_CRON_JOB_TIME =value;
        
        
       
    }
    else if(tag=='DEFAULT_GG_CONFIGURATION_CRON_TIME')
    {
        var value=lineitem[1].trim();
      
        global.DEFAULT_GG_CONFIGURATION_CRON_TIME =value;
        
        
       
    }
    else if(tag=='DEFAULT_DELETE_EVENT_SECONDS')
    {
        var value=lineitem[1].trim();
      
        global.DEFAULT_DELETE_EVENT_SECONDS =value;
        
        
       
    }
    else if(tag=='DEFAULT_DELETE_EVENT_CRON_TIME')
    {
        var value=lineitem[1].trim();
      
        global.DEFAULT_DELETE_EVENT_CRON_TIME =value;
        
        
       
    }
    else if(tag=='DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME')
    {
        var value=lineitem[1].trim();
      
        global.DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME =value;
        
        
       
    }
    else if(tag=='EXPORT_CARDHOLDER_CRON')
    {
        var value=lineitem[1].trim();
      
        global.EXPORT_CARDHOLDER_CRON =value;
        
        
       
    }
    else if(tag=='MQTT_HOST')
    {
        var value=lineitem[1].trim();
      
        global.MQTT_HOST =value;
        
        
       
    }
    else if(tag=='MQTT_USERNAME')
    {
        var value=lineitem[1].trim();
      
        global.MQTT_USERNAME =value;
        
        
       
    }
    else if(tag=='MQTT_PASSWORD')
    {
        var value=lineitem[1].trim();
      
        global.MQTT_PASSWORD =value;
       
        
        
       
    }else{
      
      //=================================================================
//======================GALLAGHER API GATEWAY========================
const gallagher_api_gateway=require("./routes/gallagher/gallagher_api_gateway");
app.use("/gallagher_api_gateway",gallagher_api_gateway);
//====================================================================
//======================FR API GATEWAY========================
const fr_api_gateway=require("./routes/fr/fr_api_gateway");
app.use("/fr_api_gateway",fr_api_gateway);
//====================================================================
//======================Schilder LIFT API GATEWAY========================
const schindler_lift_api_gateway=require("./routes/lift/schindler_lift_api_gateway");
app.use("/schindler_lift_api_gateway",schindler_lift_api_gateway);
//====================================================================
//======================Cron API GATEWAY========================
const cron_api_gateway=require("./routes/cron/cron_api_gateway");
app.use("/cron_api_gateway",cron_api_gateway);
//====================================================================
//======================MQTT CLIENT========================
const mqtt_client=require("./routes/mqtt_client");
app.use("/mqtt_client",mqtt_client);
//====================================================================
    }
});

//================================================================
//=========================CONFIG READING END HERE=================

var ssn;
app.get('/', function (req, res) {

    console.log("API SERVER IS RUNING");

});
// var sslServer=https.createServer({
// 'key':fs.readFileSync(path.join(__dirname,'cert','key.pem')),
// 'cert':fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
// },app);
// sslServer.listen(3001,function(){
//     console.log("Secure server listen on port 3001");
// });


app.listen(3001,function(){
  
    console.log("server listen on port 3000");
   
});