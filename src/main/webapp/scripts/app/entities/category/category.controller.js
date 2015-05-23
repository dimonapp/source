'use strict';

angular.module('dimonappApp')
    .controller('CategoryController', function ($scope, Category, Task, CategorySearch) {
        $scope.categorys = [];
        $scope.tasks = Task.query();
        $scope.loadAll = function() {
            Category.query(function(result) {
               $scope.categorys = result;
            });
        };
        $scope.loadAll();

        $scope.create = function () {
            Category.update($scope.category,
                function () {
                    $scope.loadAll();
                    $('#saveCategoryModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            Category.get({id: id}, function(result) {
                $scope.category = result;
                $('#saveCategoryModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            Category.get({id: id}, function(result) {
                $scope.category = result;
                $('#deleteCategoryConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Category.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteCategoryConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            CategorySearch.query({query: $scope.searchQuery}, function(result) {
                $scope.categorys = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.clear = function () {
            $scope.category = {name: null, code: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
