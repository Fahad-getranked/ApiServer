var express = require('express');
var router = express.Router();
const onvif = require('node-onvif');

router.post('/', function(req, res, next) {
  //res.send('respond with a resource');

  var req_arr = req.body;
  // Create a OnvifDevice object
  let device = new onvif.OnvifDevice({
    xaddr: req_arr.xaddr,
    user : req_arr.user,
    pass : req_arr.pass
  });
  device.init().then(() => {

    // The OnvifServicePtz object
    let ptz = device.services.ptz;
    if(!ptz) {
        throw new Error('Your ONVIF network camera does not support the PTZ service.');
    }
    // The parameters for the gotoHomePosition() method
    let profile = device.getCurrentProfile();
    

    var trans_x = parseFloat(req_arr.x);
    var trans_y = parseFloat(req_arr.y);
    var trans_z = parseFloat(req_arr.z);

    var speed_x = parseFloat(req_arr.sx);
    var speed_y = parseFloat(req_arr.sy);
    var speed_z = parseFloat(req_arr.sz);
    
    let params = {
      'ProfileToken': profile['token'],
      'Translation'    : {'x': trans_x, 'y': trans_y, 'z': trans_z},
      'Speed'       : {'x': speed_x, 'y': speed_y, 'z': speed_z}
    };

    device.services.ptz.relativeMove(params).then((result) => {
      
        res.sendStatus(200);

    }).catch((error) => {
      console.error('PTZ Error');
      res.send(error);
    });

    }).catch((error) => {
      console.error('PTZ Error');
      res.send(error);
    });
});

module.exports = router;
