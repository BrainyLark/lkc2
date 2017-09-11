const express = require('express');
const router = express.Router();
const taskController = require('../controller/TaskController');

router.get('/', function(req, res){
      taskController.getUniqueBeginners(function(err, data){
            if(err) throw err;
            else {
                  res.json({data: data});
            }
      });
});

router.post('/translation', function(req, res, next){
      var username = req.body.username;
      var domainId = req.body.domainId;

      taskController.allocateTask(username, domainId, function(id){
            res.send({"childCount": id});
      });
});

module.exports = router;
