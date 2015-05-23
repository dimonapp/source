'use strict';

angular.module('dimonappApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
