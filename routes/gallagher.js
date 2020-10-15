const express= require("express");
let router=express.Router();
router.use(function(req,res,next)
{
console.log(req.url,"@", Date.now());
next();
});
router
.route('/add_cardholder')
.get((req,res)=>{

 res.send("Hy this i gedfsdfsdfsdfsdfsdfsdfsdft cards");  

})
.post((req,res)=>{
    
    res.send("Hy this is gallagher POST cards");  

});

module.exports=router;