const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://postgres:1234@localhost:5432/lkc2');
const request = require('request');
const Tasks = require('../models/task')
// global ids for twenty five unique noun beginners

const unique_beginners_uk_ids = [
      161, 119, 124, 129, 15355, 127, 145, 138, 131, 123, 40, 132, 83505, 121, 61558, 118, 120, 143, 139, 28162, 142, 133, 130, 122, 134
];

// defining constant variables

const MAX_TRANSLATION = 5;
const STATUS_OK = 1;
const STATUS_NULL = 0;

// this function is for retrieving 25 unique beginners from the Postgres database

module.exports.getUniqueBeginners = function(callback) {
      db.many('select c.label as label, c.uk_id as uk_id, s.gloss as gloss from concepts c, vocabulary_synsets s where vocabulary_id = 1 and c.uk_id in ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) and s.concept_id = c.id', unique_beginners_uk_ids)
      .then(function(data){
            callback(null, data);
      }).catch(function(err){
            callback(err, null);
            console.log(err);
      });
}

// this function is used in tasks router
// for allocating the corresponding task with respect to username, and the domain

module.exports.allocateTask = function(username, domainId, callback) {
      const taskType = 1;
      var lastTask;
      db.one('select max(task_id) as id from task_user_log where user_name=$1 and domain_id=$2 and task_type=$3', [username, domainId, taskType]).then(function(data) {
            var last_task_id = parseInt(data.id);
            var last_task_cnt = 0;

            // run and check until task count is lower than 5 from log

            getNextTask(last_task_id, taskType, domainId, function(err, result) {
                  if(err) {
                        callback(err, null);
                  }
                  else {
                        if(result.status_code == 0) {
                              callback(null, result);
                        }
                        else if(result.status_code == 1) {
                              last_task_id = parseInt(result.id);
                              console.log("task to be performed: ", last_task_id);
                              // requesting a task object by header
                              var requestHeader = {
                                    task_id : last_task_id
                              };
                              Tasks.find({id: last_task_id}, function(rs) {
                                    // to be written
                              });
                              callback(null, result); // must return task but for now it is just task id
                        }
                  }
            });

      }).catch(function(err){
            callback(err, null);
            console.log(err);
      });
}

// unless it finds an appropriate next task for the passed task, it calls itself recursively

function getNextTask(task_id, task_type, domain_id, callback) {
      task_id = task_id + 1;
      db.oneOrNone('select task_id as id, count as cnt from task_count_log where task_id=$1 and task_type=$2 and domain_id=$3', [task_id, task_type, domain_id]).then(function(data) {

            if(data == null) {
                  callback(null, {
                        status_code : STATUS_NULL,
                        msg : "We are sorry to inform you there is no task left in this domain, try in other domains!"
                  });
            }

            var task_cnt = parseInt(data.cnt);

            // if task is fulfilled by more than 5 users then call itself
            // assuming a task with 4 count and 2 people requested it simultaneously, then count might get greater than five.

            if(task_cnt >= MAX_TRANSLATION) {
                  getNextTask(task_id, task_type, domain_id, callback);
            } else {
                  data.status_code = STATUS_OK;
                  callback(null, data); // ending condition
            }

      }).catch(function(err) {
            callback(err, null);
            console.log(err);
      });
}
