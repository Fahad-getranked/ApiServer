const express= require("express");
const axios = require('axios');
let router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));

const https=require("https");
var gr_mod = require('../../modules/gallagher_module');
var constants=require("../../constants.js");
router.use(function(req,res,next)
{
console.log(req.url,"@", Date.now());
next();
});
router.route('/add_cardholder:cardholder_id').get((req,res)=>{

 res.send("Hy this is gallagher get cards");  

});
router.route('/add_cardholder').post((req,res)=>{
var card_id= gr_mod.save_user_in_gallagher(req.body.firstname,req.body.lastname,req.body.description,req.body.division,req.body.picture);

	card_id.then(restt=>{
res.json(restt);
	});

});
router.route('/delete_cardholder').post((req,res)=>{
	var card_id= gr_mod.delete_cardholder_details(req.body.cardholder_id);
	
		card_id.then(restt=>{
	res.json(restt);
		});
	
	});
	router.route('/delete_card_details').post((req,res)=>{
		var card_id= gr_mod.delete_card_details(req.body.cardholder_id,req.body.card_id);
		
			card_id.then(restt=>{
		res.json(restt);
			});
		
		});
		router.route('/delete_access_group_details').post((req,res)=>{
			var card_id= gr_mod.delete_access_group_details(req.body.cardholder_id,req.body.group_id);
				card_id.then(restt=>{
			res.json(restt);
				});
			
			});
		

module.exports=router;