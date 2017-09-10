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

module.exports = router;
