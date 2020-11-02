const express= require("express");
const axios = require('axios');
let router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));
require ('custom-env').env('staging');
const https=require("https");
var gr_mod = require('../../modules/cron_module');

router.use(function(req,res,next)
{
console.log(req.url,"@", Date.now());
next();
});
router.route('/get_all_g_groups').get((req,res)=>{

    var groups= gr_mod.get_gallagher_access_groups();
	groups.then(access_groups=>{
res.json(access_groups);
	}); 

})

router.route('/get_all_g_zones').get((req,res)=>{
var zones= gr_mod.get_gallagher_zones();
	zones.then(access_zones=>{
res.json(access_zones);
	}); 

})

router.route('/get_all_g_doors').get((req,res)=>{

    var doors= gr_mod.get_gallagher_doors();
	doors.then(access_doors=>{
res.json(access_doors);
	}); 

})


router.route('/get_all_g_card_types').get((req,res)=>{

    var cardtypes= gr_mod.get_gallagher_card_types();
	cardtypes.then(ctype=>{
res.json(ctype);

});


})




module.exports=router;