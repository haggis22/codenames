(function (app) {

    "use strict";

    app.factory('codenames.userService', ['$rootScope',
                                            'codenames.constants', 'codenames.users.dalService', 'codenames.viewService',

        function ($rootScope,
                    constants, usersDALService, viewService) {

            return {

                login: login,
                checkSession: checkSession

            };


            function login(email, password) {

                return usersDALService.login.login({}, { email: email, password: password }).$promise

                    .then(function (result) {

                        viewService.session = result;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    });

            }  // login


            function checkSession() {

                return usersDALService.session.get().$promise

                    .then(function (session) {

                        viewService.session = session;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    });

            }  // login


        }  // outer function

    ]);

})(angular.module('codenames.app'));


