'use strict';

angular.module('dimonappApp')
    .controller('TaskController', function ($scope, Task, Category, TaskSearch, ParseLinks) {
        $scope.tasks = [];
        $scope.categorys = Category.query();
        $scope.page = 1;
        $scope.loadAll = function() {
            Task.query({page: $scope.page, per_page: 5}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.tasks = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.create = function () {
            Task.update($scope.task,
                function () {
                    $scope.loadAll();
                    $('#saveTaskModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            Task.get({id: id}, function(result) {
                $scope.task = result;
                $('#saveTaskModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            Task.get({id: id}, function(result) {
                $scope.task = result;
                $('#deleteTaskConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Task.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteTaskConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            TaskSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.tasks = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.clear = function () {
            $scope.task = {title: null, content: null, reward: null, until: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
