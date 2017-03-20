'use strict';

var angular = require('angular');
var mediatorSubscribers = require('./mediator-subscribers');
var mediator = require('fh-wfm-mediator/lib/mediator');

var config = {
  mode: 'admin',
  listColumnViewId: 'column2',
  mainColumnViewId: 'content@app'
};

angular.module('app', [
  require('angular-ui-router'),
  require('angular-material'),
  require('ng-sortable'),
  require('fh-wfm-mediator'),
  require('../workorders/workorder'),
  require('fh-wfm-risk-assessment'),
  require('fh-wfm-workflow-angular')(config)
]);


//Initialising the application with required serviceconfig and initialising script.
function AppConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/workflows/list');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      data: {
        columns: 3
      },
      controller: function($scope, $state, $mdSidenav, mediator) {
        mediatorSubscribers.unsubscribeAll(mediator);
        mediatorSubscribers.setupSubscribers(mediator, $scope);

        $scope.$state = $state;
        $scope.toggleSidenav = function(event, menuId) {
          $mdSidenav(menuId).toggle();
          event.stopPropagation();
        };
        $scope.navigateTo = function(state, params) {
          if (state) {
            if ($mdSidenav('left').isOpen()) {
              $mdSidenav('left').close();
            }
            $state.go(state, params);
          }
        };
      }
    });
}

angular.module('app').config(["$stateProvider", "$urlRouterProvider", AppConfig]);

angular.module('app').run(function($state) {
  require('../workorders/workorder');
  console.log('>>>>>>>', $state.get());
});