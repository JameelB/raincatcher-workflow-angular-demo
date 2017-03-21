var getSampleWorkorders = require('../sample-data/workorders')();
angular.module('app.workorder', [
  'ui.router'
])

.config(function($stateProvider) {
  var views = {};

  views['column2'] = {
      templateUrl: '/workorders/workorder.tpl.html',
      controller: 'WorkordersCtrl as ctrl'
  };

  $stateProvider
    .state('app.workorders', {
      url: '/workorders',
      views: views
  });
})

.controller('WorkordersCtrl', function($scope, $state, mediator) {
  $scope.workorders = getSampleWorkorders;


  $scope.selectWorkorder = function(event, workorder) {
    mediator.publish('wfm:ui:workflow:begin', workorder);
    event.preventDefault();
    event.stopPropagation();
  }
});

module.exports = 'app.workorder';