var shortid = require('shortid');
var sampleWorkflows = require('../sample-data/workflows')();
var sampleWorkorders = require('../sample-data/workorders')();
var sampleResults = [];
var CONSTANTS = require('./constants');

function unsubscribeAll(mediator) {
  mediator.remove(CONSTANTS.WORKFLOWS.CREATE);
  mediator.remove(CONSTANTS.WORKFLOWS.READ);
  mediator.remove(CONSTANTS.WORKFLOWS.UPDATE);
  mediator.remove(CONSTANTS.WORKFLOWS.DELETE);
  mediator.remove(CONSTANTS.WORKFLOWS.LIST);
  mediator.remove(CONSTANTS.WORKORDERS.LIST);
  mediator.remove(CONSTANTS.RESULTS.LIST);
  mediator.remove(CONSTANTS.APPFORMS.LIST);
}
//Mock Subscribers for workflow mediator topics
function setupSubscribers(mediator, $scope) {
  // Workflow CRUDL subscribers
  mediator.subscribe(CONSTANTS.WORKFLOWS.CREATE, function(data) {
    data.workflowToCreate = JSON.parse(angular.toJson(data.workflowToCreate));
    data.workflowToCreate.id = data.topicUid;
    sampleWorkflows.push(data.workflowToCreate);
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.CREATE + ':' + data.topicUid, data.workflowToCreate);
  });

  mediator.subscribeForScope(CONSTANTS.WORKFLOWS.READ, $scope,function(data) {
    var obj = _.find(sampleWorkflows, function(obj) {
      return obj.id == data.topicUid;
    });
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.READ + ':' + data.topicUid, obj)
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.UPDATE, function(data) {
    sampleWorkflows.forEach(function(obj) {
      if(obj.id === data.topicUid) {
        obj = data.workflowToUpdate;
      }
    });
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.UPDATE + ':' + data.topicUid, data.workflowToUpdate);
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.DELETE, function(data) {
    sampleWorkflows = sampleWorkflows.filter(function(obj) {
      return obj.id !== data.topicUid;
    });
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.DELETE + ':'+ data.topicUid, data.topicUid);
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.LIST, function() {
    console.log('>>>>>>>data', sampleWorkflows);
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.LIST, sampleWorkflows)
  });


  //Subscribers for results, workorders and appforms
  mediator.subscribe(CONSTANTS.RESULTS.LIST, function() {
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.RESULTS.LIST, sampleResults);
  });

  mediator.subscribe(CONSTANTS.WORKORDERS.LIST, function() {
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKORDERS.LIST, sampleWorkorders);
  });

  mediator.subscribe(CONSTANTS.APPFORMS.LIST, function() {
    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.APPFORMS.LIST, []);
  });

  //Subscribers for Workflow process
  mediator.subscribe(CONSTANTS.WORKFLOWS.STEP.SUMMARY, function(data) {
    var result = _.find(sampleResults, function(obj) {
      return obj.workorderId === data.workorderId;
    });

    if(!result) {
      result = {};
      result.id = shortid.generate();
      result.workorderId = data.workorderId;
      result.nextStepIndex = 0;
      result.stepResults = {};
      result.status = 'New';
    }

    var workorder = _.find(sampleWorkorders, function(obj) {
      return obj.id === data.workorderId;
    });

    var workflow = _.find(sampleWorkflows, function(obj) {
      return obj.id === workorder.workflowId;
    });

    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.STEP.SUMMARY + ':' + data.topicUid, {
      workorder: workorder,
      workflow: workflow,
      status: result.status,
      nextStepIndex: result.nextStepIndex,
      result: result
    })
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.STEP.BEGIN, function(data) {
    //TODO
    var result = _.find(sampleResults, function(obj) {
      return obj.workorderId === data.workorderId;
    });
    console.log('>>>>>>>', result);
    if(!result) {
      result = {};
      result.workorderId = data.workorderId;
      result.nextStepIndex = 0;
      result.stepResults = {};
      result.status = 'In Progress';

      console.log('New Result Added ', result);
      sampleResults.push(result);
    }


    var workorder = _.find(sampleWorkorders, function(obj) {
      return obj.id === data.workorderId;
    });

    var workflow = _.find(sampleWorkflows, function(obj) {
      return obj.id === workorder.workflowId;
    });

    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.STEP.BEGIN + ':' + data.topicUid, {
      workorder: workorder,
      workflow: workflow,
      result: result,
      nextStepIndex: result.nextStepIndex,
      step: result.nextStepIndex > -1 ? workflow.steps[result.nextStepIndex] : workflow.steps[0]
    });
  });

  mediator.subscribe(CONSTANTS.WORKFLOWS.STEP.COMPLETE, function(data) {
    console.log('>>>>>>>', data);
    console.log('>>>>>>>', sampleResults);

    var result = _.find(sampleResults, function(obj) {
      return obj.workorderId === data.workorderId;
    });

    var workorder = _.find(sampleWorkorders, function(obj) {
      return obj.id === data.workorderId;
    });

    var workflow = _.find(sampleWorkflows, function(obj) {
      return obj.id === workorder.workflowId;
    });

    result.nextStepIndex = _.findIndex(workflow.steps, function(obj) { return obj.code === data.stepCode}) + 1;
    result.stepResults[data.stepCode] = data.submission;

    console.log('>>>>>>>', result.nextStepIndex, workflow.steps.length);
    if(result.nextStepIndex >= workflow.steps.length) {
      console.log('>>>>>>>set result status to complete' );
      result.status = 'Complete';
    }

    mediator.publish(CONSTANTS.DONE_PREFIX + CONSTANTS.WORKFLOWS.STEP.COMPLETE + ':' + data.topicUid, {
      workorder: workorder,
      workflow: workflow,
      result: result,
      nextStepIndex: result.nextStepIndex,
      step: result.nextStepIndex > -1 ? workflow.steps[result.nextStepIndex] : workflow.steps[0]
    })

  });
}

module.exports = {
  unsubscribeAll: unsubscribeAll,
  setupSubscribers: setupSubscribers
};