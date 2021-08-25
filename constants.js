// var mysql = require('mysql');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database : "imperium_app"
//   });

//   con.connect(function(err) {
//     if (err){
// console.log("DATABASE CONNECTION ERROR");
//     } else{
//         con.query('SELECT configurations.key_value,configurations.device_id,config_keys.name,config_keys.data_type FROM `configurations` INNER JOIN config_keys  ON  config_keys.id=configurations.key_id where config_keys.status=1 order by configurations.device_id ASC', function (error, results, fields) {
//             if (error)
//             {
//            // , results[0].solution
//            console.log(error);
//             }else{
//                 var constsarray=[];
//         for(var i=0;i<results.length;i++)
//         {
//              var tag=results[i].name ;
//             var value=results[i].key_value;
//              if(tag=='GALLAGHER_KEY')
//              {
                 
               
//                  exports.GALLAGHER_KEY = value;
                
                 
                
//              }else if(tag=='GALLAGHER_HOST')
//              {
                 
               
//                  exports.GALLAGHER_HOST =value;
                 
                 
                
//              }
//              else if(tag=='CODE')
//              {
                 
               
//                  exports.CODE =value;
                 
                 
                
//              }
//              else if(tag=='FR_HOST')
//              {
                 
                 
               
//                  exports.FR_HOST =value;
                 
                 
                
//              }
//              else if(tag=='FR_EVENT_URL')
//              {
                 
               
//                  exports.FR_EVENT_URL =value;
                 
                 
                
//              }
//              else if(tag=='EXTERNAL_SYSTEM_URL')
//              {
                 
               
//                  exports.EXTERNAL_SYSTEM_URL =value;
                 
                 
                
//              }
//              else if(tag=='FR_SUBSCRIPTION')
//              {
                 
               
//                  exports.FR_SUBSCRIPTION =value;
                 
                 
                
//              }
//              else if(tag=='FR_THERMAL_CAMERA_EVENT_CODE')
//              {
                 
               
//                  exports.FR_THERMAL_CAMERA_EVENT_CODE =value;
                 
                 
                
//              }
//              else if(tag=='FR_FACE_EVENT_CODE')
//              {
                 
//                  exports.FR_FACE_EVENT_CODE =value;
                 
                 
                
//              }
//              else if(tag=='FR_KEY')
//              {
                 
               
//                  exports.FR_KEY =value;
                 
                 
                
//              }
//              else if(tag=='FR_SECRET_KEY')
//              {
                 
               
//                  exports.FR_SECRET_KEY =value;
                 
                 
                
//              }
//              else if(tag=='FR_LOCAL_IP')
//              {
                 
               
//                  exports.FR_LOCAL_IP =value;
                 
                 
                
//              }
//              else if(tag=='FR_LOCAL_IP')
//              {
                 
               
//                  exports.FR_LOCAL_IP =value;
                 
                 
                
//              }
//              else if(tag=='FR_PORT')
//              {
                 
               
//                  exports.FR_PORT =value;
                 
                 
                
//              }
//              else if(tag=='FR_PROTOCOL')
//              {
                 
               
//                  exports.FR_PROTOCOL =value;
                 
                 
                
//              }
//              else if(tag=='LIFT_HOST')
//              {
                 
               
//                  exports.LIFT_HOST =value;
                 
                 
                
//              }
//              else if(tag=='LOGIN_LIFT_USER')
//              {
                 
               
//                  exports.LOGIN_LIFT_USER =value;
                 
                 
                
//              }
//              else if(tag=='LOGIN_LIFT_PASSWORD')
//              {
                 
               
//                  exports.LOGIN_LIFT_PASSWORD =value;
                 
                 
                
//              }
//              else if(tag=='BASE_SERVER_URL')
//              {
                 
               
//                  exports.BASE_SERVER_URL =value;
                 
                 
                
//              }
//              else if(tag=='DEFAUL_EVENT_SECONDS')
//              {
                 
               
//                  exports.DEFAUL_EVENT_SECONDS =value;
                 
                 
                
//              }
//              else if(tag=='DEFAULT_EVENT_CRON_JOB_TIME')
//              {
                 
               
//                  exports.DEFAULT_EVENT_CRON_JOB_TIME =value;
                 
                 
                
//              }
//              else if(tag=='DEFAULT_GG_CONFIGURATION_CRON_TIME')
//              {
                 
               
//                  exports.DEFAULT_GG_CONFIGURATION_CRON_TIME =value;
                 
                 
                
//              }
//              else if(tag=='DEFAULT_DELETE_EVENT_SECONDS')
//              {
                 
               
//                  exports.DEFAULT_DELETE_EVENT_SECONDS =value;
                 
                 
                
//              }
//              else if(tag=='DEFAULT_DELETE_EVENT_CRON_TIME')
//              {
                 
               
//                  exports.DEFAULT_DELETE_EVENT_CRON_TIME =value;
                 
                 
                
//              }
//              else if(tag=='DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME')
//              {
                 
               
//                  exports.DEFAULT_ADD_CARDHOLDER_EVENT_CRON_TIME =value;
                 
                 
                
//              }
//              else if(tag=='EXPORT_CARDHOLDER_CRON')
//              {
                 
               
//                  exports.EXPORT_CARDHOLDER_CRON =value;
                 
                 
                
//              }
             
//              else if(tag=='EXPORT_FR_USER_CRON')
//              {
                 
               
//                  exports.EXPORT_FR_USER_CRON =value;
                 
                 
                
//              }
//              else if(tag=='DEFAULT_ADD_FR_USER_EVENT_CRON_TIME')
//              {
                 
               
//                  exports.DEFAULT_ADD_FR_USER_EVENT_CRON_TIME =value;
                 
                 
                
//              }
//              else if(tag=='MQTT_HOST')
//              {
                 
               
//                  exports.MQTT_HOST =value;
                 
                 
                
//              }
//              else if(tag=='MQTT_USERNAME')
//              {
                 
               
//                  exports.MQTT_USERNAME =value;
                 
                 
                
//              }
//              else if(tag=='MQTT_PASSWORD')
//              {
                 
              
//                  exports.MQTT_PASSWORD =value;
                
                 
                 
                
//              }
//              else if(tag=='STREAM_START_PORT')
//              {
                 
              
//                  exports.STREAM_START_PORT =value;
                
                 
                 
                
//              }
//              else if(tag=='BIO_STAR_URL')
//              {
                 
              
//                  exports.BIO_STAR_URL =value;
                
                 
                 
                
//              }
//              else if(tag=='BIO_STAR_NAME')
//              {
                 
              
//                  exports.BIO_STAR_NAME =value;
                
                 
                 
                
//              }
//              else if(tag=='BIO_STAR_USERNAME')
//              {
                 
              
//                  exports.BIO_STAR_USERNAME =value;
                
                 
                 
                
//              }
//              else if(tag=='BIO_STAR_PASSWORD')
//              {
                 
              
//                  exports.BIO_STAR_PASSWORD =value;  
                
//              }
//              else if(tag=='FingerScanQuality')
//              {
                 
              
//                  exports.FingerScanQuality =value;  
                
//              }
//              else if(tag=='FR_MOTION_DETECTION_CAMERA_CODE')
//              {
                 
              
//                  exports.FR_MOTION_DETECTION_CAMERA_CODE =value;  
                
//              }
           
//         }
//     // return constsarray;
//             }

//           });
//     }
   
//   });

//   function insert_lods_into_db()
//   {
//     console.log("Wewee");
//   }
//con.end();
//=========================CONFIG READING============
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
    else if(tag=='FR_EVENT_URL')
    {
        var value=lineitem[1].trim();
      
        exports.FR_EVENT_URL =value;
        
        
       
    }
    else if(tag=='EXTERNAL_SYSTEM_URL')
    {
        var value=lineitem[1].trim();
      
        exports.EXTERNAL_SYSTEM_URL =value;
        
        
       
    }
    else if(tag=='FR_SUBSCRIPTION')
    {
        var value=lineitem[1].trim();
      
        exports.FR_SUBSCRIPTION =value;
        
        
       
    }
    else if(tag=='FR_THERMAL_CAMERA_EVENT_CODE')
    {
        var value=lineitem[1].trim();
      
        exports.FR_THERMAL_CAMERA_EVENT_CODE =value;
        
        
       
    }
    else if(tag=='FR_FACE_EVENT_CODE')
    {
        var value=lineitem[1].trim();
        exports.FR_FACE_EVENT_CODE =value;
        
        
       
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
    
    else if(tag=='EXPORT_FR_USER_CRON')
    {
        var value=lineitem[1].trim();
      
        exports.EXPORT_FR_USER_CRON =value;
        
        
       
    }
    else if(tag=='DEFAULT_ADD_FR_USER_EVENT_CRON_TIME')
    {
        var value=lineitem[1].trim();
      
        exports.DEFAULT_ADD_FR_USER_EVENT_CRON_TIME =value;
        
        
       
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
    else if(tag=='STREAM_START_PORT')
    {
        var value=lineitem[1].trim();
     
        exports.STREAM_START_PORT =value;
       
        
        
       
    }
    else if(tag=='BIO_STAR_URL')
    {
        var value=lineitem[1].trim();
     
        exports.BIO_STAR_URL =value;
       
        
        
       
    }
    else if(tag=='BIO_STAR_NAME')
    {
        var value=lineitem[1].trim();
     
        exports.BIO_STAR_NAME =value;
       
        
        
       
    }
    else if(tag=='BIO_STAR_USERNAME')
    {
        var value=lineitem[1].trim();
     
        exports.BIO_STAR_USERNAME =value;
       
        
        
       
    }
    else if(tag=='BIO_STAR_PASSWORD')
    {
        var value=lineitem[1].trim();
     
        exports.BIO_STAR_PASSWORD =value;  
       
    }
    else if(tag=='FingerScanQuality')
    {
        var value=lineitem[1].trim();
     
        exports.FingerScanQuality =value;  
       
    }
    else if(tag=='FR_MOTION_DETECTION_CAMERA_CODE')
    {
        var value=lineitem[1].trim();
     
        exports.FR_MOTION_DETECTION_CAMERA_CODE =value;  
       
    }
    
});