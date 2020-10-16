const express= require("express");
const axios = require('axios');
let router=express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));
require ('custom-env').env('staging');
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
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    // res.send(user_id + ' ' + token + ' ' + geo);
    return res.json(req.body);
  //  res.send("Hy this is gallagher POST cards");  

});

module.exports=router;