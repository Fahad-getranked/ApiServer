const express= require("express");
const https=require("https");
const path=require("path");
const fs=require("fs");
const app=express();
require ('custom-env').env('staging');
app.use(express.json());

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
//======================MQTT CLIENT========================
const mqtt_client=require("./routes/mqtt_client");
app.use("/mqtt_client",mqtt_client);
//====================================================================

app.get('/',function(req,res){
res.send("Gatewayyyyyy");

});
var sslServer=https.createServer({
'key':fs.readFileSync(path.join(__dirname,'cert','key.pem')),
'cert':fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
},app);
sslServer.listen(3001,function(){
    console.log("Secure server listen on port 3001");
});


// app.listen(3001,function(){
//     console.log("server listen on port 3001");
// });