const express= require("express");
let router=express.Router();
router.use(function(req,res,next)
{
console.log(req.url,"@", Date.now());
next();
});
router
.route('/configuration')
.get((req,res)=>{

 res.send("Hy this is mqtt get config");  
})
.post((req,res)=>{
    res.send("Hy this is mqtt post config");  

});

module.exports=router;