const express= require("express");
const axios = require('axios');
let router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));
require ('custom-env').env('staging');
const https=require("https");
var fr_mod = require('../../modules/fr_module');


router.use(function(req,res,next)
{
console.log(req.url,"@", Date.now());
next();
});
router
.route('/add_face_recognition_user')
.get((req,res)=>{

 res.send("Hy this is FR get cards");  

});
router
.route('/add_face_recognition_user').post((req,res)=>{
	
	var face_id = fr_mod.add_fr_user(req.body.firstname,req.body.lastname,req.body.description,req.body.division,req.body.picture);

	face_id.then(restt=>{
res.send(restt);
	});

});


module.exports=router;