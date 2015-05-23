'use strict';

angular.module('dimonappApp')
    .controller('CategoryDetailController', function ($scope, $stateParams, Category, Task) {
        $scope.category = {};
        $scope.load = function (id) {
            Category.get({id: id}, function(result) {
              $scope.category = result;
            });
        };
        $scope.load($stateParams.id);
    });
