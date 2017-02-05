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
                })

                .state('main.game', {
                    url: "/game/:gameID",
                    templateUrl: "/modules/game/index.html?v=" + (new Date()).getTime(),
                    controller: ['$stateParams', 'codenames.viewService',
                        function ($stateParams, viewService) {

                            viewService.gameID = $stateParams.gameID;

                        }
                    ]
                });


        }
    ]);


})(angular.module('codenames.app'));