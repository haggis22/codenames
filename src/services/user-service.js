(function (app) {

    "use strict";

    app.factory('codenames.userService', ['$rootScope',
                                            'codenames.constants', 'codenames.users.dalService', 'codenames.viewService', 'codenames.errorParser',

        function ($rootScope,
                    constants, usersDALService, viewService, errorParser) {

            return {

                login: login,
                logout: logout,
                checkSession: checkSession

            };


            function login(email, password) {

                return usersDALService.login.login({}, { email: email, password: password }).$promise

                    .then(function (result) {

                        viewService.session = result;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Login failure', error));

                    });

            }  // login




            function logout() {

                return usersDALService.logout.logout({}, {}).$promise

                    .then(function () {

                        viewService.session = null;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    })
                    .catch(function(error) { 

                        $rootScope.$broadcast(constants.events.ERROR, errorParser.parse('Log out failure', error));

                    });

            }  // logout


            function checkSession() {

                return usersDALService.session.get().$promise

                    .then(function (session) {

                        viewService.session = session;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    });

            }  // checkSession




        }  // outer function

    ]);

})(angular.module('codenames.app'));


