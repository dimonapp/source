'use strict';

angular.module('dimonappApp')
    .factory('TaskSearch', function ($resource) {
        return $resource('api/_search/tasks/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
