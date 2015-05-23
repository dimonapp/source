'use strict';

angular.module('dimonappApp')
    .controller('TaskDetailController', function ($scope, $stateParams, Task, Category) {
        $scope.task = {};
        $scope.load = function (id) {
            Task.get({id: id}, function(result) {
              $scope.task = result;
            });
        };
        $scope.load($stateParams.id);
    });
