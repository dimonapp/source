'use strict';

angular.module('dimonappApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


