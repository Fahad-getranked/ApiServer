//=========================CONFIG READING============
//===================================================
const lineReader = require('line-reader');
lineReader.eachLine('./config.txt', function(line) {
    var lineitem=line.split('=');
    // console.log(lineitem[0]+"--------------"+lineitem[1]);
    var tag=lineitem[0].trim();
    if(tag=='GALLAGHER_KEY')
    {
        var value=lineitem[1].trim();
      
        exports.GALLAGHER_KEY = value;
       
        
       
    }else if(tag=='GALLAGHER_HOST')
    {
        var value=lineitem[1].trim();
      
        exports.GALLAGHER_HOST =value;
        
        
       
    }
    else if(tag=='CODE')
    {
        var value=lineitem[1].trim();
      
        exports.CODE =value;
        
        
       
    }
    else if(tag=='FR_HOST')
    {
        var value=lineitem[1].trim();
      
        exports.FR_HOST =value;
        
        
       
    }
    else if(tag=='FR_KEY')
    {
        var value=lineitem[1].trim();
      
        exports.FR_KEY =value;
        
        
       
    }
    else if(tag=='FR_SECRET_KEY')
    {
        var value=lineitem[1].trim();
      
        exports.FR_SECRET_KEY =value;
        
        
       
    }
    else if(tag=='FR_LOCAL_IP')
    {
        var value=lineitem[1].trim();
      
        exports.FR_LOCAL_IP =value;
        
        
       
    }
    else if(tag=='FR_LOCAL_IP')
    {
        var value=lineitem[1].trim();
      
        exports.FR_LOCAL_IP =value;
        
        
       
    }
    else if(tag=='FR_PORT')
    {
        var value=lineitem[1].trim();
      
        exports.FR_PORT =value;
        
        
       
    }
    else if(tag=='FR_PROTOCOL')
    {
        var value=lineitem[1].trim();
      
        exports.FR_PROTOCOL =value;
        
        
       
    }
    else if(tag=='LIFT_HOST')
    {
        var value=lineitem[1].trim();
      
        exports.LIFT_HOST =value;
        
        
       
    }
    else if(tag=='LOGIN_LIFT_USER')
    {
        var value=lineitem[1].trim();
      
        exports.LOGIN_LIFT_USER =value;
        
        
       
    }
    else if(tag=='LOGIN_LIFT_PASSWORD')
    {
        var value=lineitem[1].trim();
      
        exports.LOGIN_LIFT_PASSWORD =value;
        
        
       
    }
    else if(tag=='BASE_SERVER_URL')
    {
        var value=lineitem[1].trim();
      
        exports.BASE_SERVER_URL =value;
        
        
       
    }
    else if(tag=='DEFAUL_EVENT_SECONDS')
    {
        var value=lineitem[1].trim();
      
        exports.DEFAUL_EVENT_SECONDS =value;
        
        
       
    }
    else if(tag=='DEFAULT_EVENT_CRON_JOB_TIME')
    {
        var value=lineitem[1].trim();
      
        exports.DEFAULT_EVENT_CRON_JOB_TIME =value;
        
        
       
    }
    else if(tag=='DEFAULT_GG_CONFIGURATION_CRON_TIME')
    {
        var value=lineitem[1].trim();
      
        exports.DEFAULT_GG_CONFIGURATION_CRON_TIME =value;
        
        
       
    }
    else if(tag=='DEFAULT_DELETE_EVENT_SECONDS')
    {
        var value=lineitem[1].trim();
      
        exports.DEFAULT_DELETE_EVENT_SECONDS =value;
        
        
       
    }
    else if(tag=='DEFAULT_DELETE_EVENT_CRON_TIME')
    {
        var value=lineitem[1].trim();
      
        exports.DEFAULT_DELETE_EVENT_CRON_TIME =value;
        
        
       
    }
    else if(tag=='DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME')
    {
        var value=lineitem[1].trim();
      
        exports.DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME =value;
        
        
       
    }
    else if(tag=='EXPORT_CARDHOLDER_CRON')
    {
        var value=lineitem[1].trim();
      
        exports.EXPORT_CARDHOLDER_CRON =value;
        
        
       
    }
    else if(tag=='MQTT_HOST')
    {
        var value=lineitem[1].trim();
      
        exports.MQTT_HOST =value;
        
        
       
    }
    else if(tag=='MQTT_USERNAME')
    {
        var value=lineitem[1].trim();
      
        exports.MQTT_USERNAME =value;
        
        
       
    }
    else if(tag=='MQTT_PASSWORD')
    {
        var value=lineitem[1].trim();
     
        exports.MQTT_PASSWORD =value;
       
        
        
       
    }
});