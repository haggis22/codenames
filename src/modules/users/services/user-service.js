(function (app) {

    "use strict";

    app.factory('codenames.userService', ['$rootScope',
                                            'h22.errorService',
                                            'codenames.Constants', 'codenames.users.dalService', 'codenames.viewService',
                                            'codenames.User',

        function ($rootScope,
                    errorService,
                    constants, dalService, viewService,
                    User) {

            return {

                initializeUser: initializeUser,
                register: register,
                login: login,
                logout: logout,
                checkSession: checkSession

            };

            function initializeUser() {

                viewService.user = new User();

            };


            function validateRegistration()
            {
                return viewService.user != null;
            
            }  // validateRegistration


            function register() {

                if (!validateRegistration(viewService.user))
                {
                    return;
                }

                return dalService.register.save({}, viewService.user).$promise

                    .then(function (result) {

                        viewService.session = result;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    })
                    .catch(function(error) { 

                        errorService.addError('Registration failure', error);

                    });

            }  // register


            function login(email, password) {

                dalService.login.login({}, { email: email, password: password }).$promise

                    .then(function (result) {

                        viewService.session = result;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    })
                    .catch(function(error) { 

                        errorService.addError('Login failure', error);

                    });

            }  // login




            function logout() {

                dalService.logout.logout({}, {}).$promise

                    .then(function () {

                        viewService.session = null;
                        $rootScope.$broadcast(constants.events.SESSION_CHANGE);

                    })
                    .catch(function(error) { 

                        errorService.addError('Log out failure', error);

                    });

            }  // logout


            function checkSession() {

                dalService.session.get().$promise

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


