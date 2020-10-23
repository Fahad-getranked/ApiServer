const express= require("express");
const axios = require('axios');
let router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));
require ('custom-env').env('staging');
const https=require("https");
var gr_mod = require('../../modules/gallagher_module');

router.use(function(req,res,next)
{
console.log(req.url,"@", Date.now());
next();
});
router
.route('/add_cardholder:cardholder_id')
.get((req,res)=>{

 res.send("Hy this is gallagher get cards");  

});
router
.route('/add_cardholder').post((req,res)=>{

	var card_id= gr_mod.save_user_in_gallagher(req.body.firstname,req.body.lastname,req.body.description,req.body.division,req.body.picture);

	card_id.then(restt=>{
res.json(restt);
	});

});



module.exports=router;