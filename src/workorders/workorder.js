var getSampleWorkorders = require('../sample-data/workorders')();
angular.module('app.workorder', [
  'ui.router'
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.workorders', {
      url: '/workorders',
      views: {
        content: {
          templateUrl: '/workorders/workorder.tpl.html',
          controller: 'WorkordersCtrl as ctrl'
        }
      }
  });
})

.controller('WorkordersCtrl', function($scope, mediator) {
  console.log('>>>>>>>workorders controller');
  $scope.workorders = getSampleWorkorders;
  console.log('>>>>>>>scope workorders', $scope.workorders);
});

module.exports = 'app.workorder';