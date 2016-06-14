/*
 Application controllers
 Main controllers for the app
 */

angular.module("login.controllers", [])
    .controller("AdminAppCtrl", 
        ["$scope", "$location",
        function ($scope, $location) {
            $scope.checkIfOwnPage = function () {
            return _.contains(
                [
                    "/404", 
                    "/pages/500",
                    "/pages/login",
                    "/pages/signin",
                    "/pages/signin1",
                    "/pages/signin2",
                    "/pages/signup",
                    "/pages/signup1",
                    "/pages/signup2",
                    "/pages/forgot",
                    "/pages/lock-screen"
                ], $location.path());
            };

        $scope.info = {
            theme_name: "Kimono",
            user_name: "John Doe"
            };
        }
    ])
    .controller("NavCtrl", 
        ["$scope",
        function ($scope) {
            $scope.navInfo = {
                tasks_number: 5,
                widgets_number: 13
            };

            $scope.toggleAlternativeMenu = function(){
                $('body .page-wrapper').toggleClass('nav-style--alternative');
            };

        }
    ])
    .controller("DashboardCtrl", 
        ["$scope",
        function ($scope) {

        }
    ]);
