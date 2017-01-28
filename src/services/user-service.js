(function (app) {

    "use strict";

    app.factory('codenames.userService', ['$rootScope', 
                                            'codenames.users.dalService', 'codenames.viewService',

        function ($rootScope, 
                    usersDALService, viewService) {

            return {

                login: login

            };

            function login(email, password) {

                return usersDALService.login.login({}, { email: email, password: password }).$promise

                    .then(function (result) {

                        viewService.session = result;
                        $rootScope.$broadcast('login');

                    });


            }

        }  // outer function

    ]);

})(angular.module('codenames.app'));


