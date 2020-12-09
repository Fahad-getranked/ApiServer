const express= require("express");
const axios = require('axios');
let router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));

const https=require("https");
var lift_mod = require('../../modules/lift_module');
var constants=require("../../constants.js");

router.use(function(req,res,next)
{
console.log(req.url,"@", Date.now());
next();
});
router.route('/add_user_in_schindler_lift').get((req,res)=>{

 res.send("Hy this is LIFT");  

});
router.route('/add_user_in_schindler_lift').post((req,res)=>{

var lift_id = lift_mod.add_lift_user(req.body.firstname,req.body.lastname,req.body.description,req.body.division,req.body.picture);

 lift_id.then(restt=>{
 res.send(restt);
 });

});
router.route('/delete_lift_user').post((req,res)=>{

    var lift_id = lift_mod.delete_lift_user(req.body.lift_id);
    
     lift_id.then(restt=>{
     res.send(restt);
     });
    
    });

module.exports=router;