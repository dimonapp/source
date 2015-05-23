'use strict';

angular.module('dimonappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('task', {
                parent: 'entity',
                url: '/task',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'dimonappApp.task.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/task/tasks.html',
                        controller: 'TaskController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('task');
                        return $translate.refresh();
                    }]
                }
            })
            .state('taskDetail', {
                parent: 'entity',
                url: '/task/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'dimonappApp.task.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/task/task-detail.html',
                        controller: 'TaskDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('task');
                        return $translate.refresh();
                    }]
                }
            });
    });
