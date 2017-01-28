(function (app) {

    "use strict";

    app.config(['$stateProvider', '$urlRouterProvider',

        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/main/login');

            $stateProvider

                .state('main', {
                    url: "/main",
                    templateUrl: "/modules/main/index.html?v=" + (new Date()).getTime()
                })

                .state('main.login', {
                    url: "/login",
                    templateUrl: "/modules/users/login/index.html?v=" + (new Date()).getTime()
                })

                .state('main.lobby', {
                    url: "/lobby",
                    templateUrl: "/modules/lobby/index.html?v=" + (new Date()).getTime()
                });

        }
    ]);


})(angular.module('codenames.app'));