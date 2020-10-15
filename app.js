const express= require("express");
const https=require("https");
const path=require("path");
const fs=require("fs");

const axios = require('axios');
const app=express();
require ('custom-env').env('staging');
const gallagher=require("./routes/gallagher");
const mqtt=require("./routes/mqtt");
app.use(express.json());
app.use("/gallagher",gallagher);
app.use("/mqtt",mqtt);



app.get('/',function(req,res){
res.send(process.env.GALLAGHER_KEY);

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