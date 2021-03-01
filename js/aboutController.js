(function () {
    'use strict';

    tmsApp.controller('aboutController', ["$scope", "$rootScope", function ($scope, $rootScope) {
        var vm = $scope;
        $rootScope.pageInfo.pageTitle = Localization["About"];
        $rootScope.pageInfo.pageDescription = "Overview of the app"
    }]);
})();