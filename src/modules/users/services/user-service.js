(function (app) {

    "use strict";

    app.factory('codenames.userService', ['$rootScope',
                                            'codenames.Constants', 'codenames.users.dalService', 'codenames.viewService', 'codenames.errorParser',

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

                        // in case the session fails, the object is still not null - it has the properties
                        // related to the promise. We need to look for the hash property specifically

                        if (session && session.hash)
                        {
                            viewService.session = session;
                        }
                        else
                        {
                            delete viewService.session;
                        }

                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    });

            }  // checkSession




        }  // outer function

    ]);

})(angular.module('codenames.app'));


