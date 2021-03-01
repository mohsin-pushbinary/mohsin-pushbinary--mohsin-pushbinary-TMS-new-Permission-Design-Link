 'use strict';


 var tmsApp = angular.module("tmsApp", ['ngRoute', 'ngToast', 'ngMessages', 'bw.paging', 'ngMap', 'tmsDirectives', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'chart.js', 'angular.vertilize']);

//Define App Setting Constants

 tmsApp.directive("ngUnique", function ($http, APP_SETTINGS) {
     return {
         restrict: 'A',
         require: 'ngModel',
         link: function (scope, element, attrs, ngModel) {
             scope.$watch(attrs['ngModel'], function (v) {
                 if (!ngModel || !element.val()) return;
                 var url = scope.$eval(attrs.ngUnique).url;
                 var currentValue = element.val();
                 $http.post(APP_SETTINGS.API_BASE_URI + url, '"' + currentValue + '"')
                 .success(function (data) {
                     if (currentValue == element.val()) {
                         console.log('unique = ' + data.Data);
                         ngModel.$setValidity('unique', data.Data);
                         scope.$broadcast('show-errors-check-validity');
                     }
                 })
             });
         }
     }
 });

 //var API_BASE_URI = "http://localhost:62965/api/Admin/";
 var API_BASE_URI = "http://5.175.7.57:96/api/Admin/";
 //var API_BASE_URI = "http://192.168.31.229:8011/api/Admin/";
 //var API_BASE_URI = "https://www.tmsportal.de/TMS.Apide/api/Admin/";
 //var API_BASE_URI = "http://5.175.7.57/TMS.Apistg/api/Admin/";

 tmsApp.directive("nguniqueedituser", function ($http) {
     return {
         restrict: 'A',
         require: 'ngModel',
         link: function (scope, element, attrs, ngModel) {
             scope.$watch(attrs['ngModel'], function (v) {
                 if (!ngModel || !element.val()) return;
                 var keyProperty = attrs.nguniqueedituser;
                 var url = "Account/IsEmailExists";
                 var currentValue = element.val();
                 if (keyProperty && keyProperty != "") {
                     if (keyProperty == currentValue) {
                         ngModel.$setValidity('unique', true);
                         scope.$broadcast('show-errors-check-validity');
                         return;
                     }
                 }
                 $http.post(API_BASE_URI + url, '"' + currentValue + '"')
                 .success(function (data) {
                     if (currentValue == element.val()) {
                         console.log('unique = ' + data.Data);
                         ngModel.$setValidity('unique', data.Data);
                         scope.$broadcast('show-errors-check-validity');

                     }
                 })
             });
         }
     }
 });

tmsApp.constant("APP_SETTINGS", {
    //"API_BASE_URI": "http://localhost:62965/api/",
    "API_BASE_URI": "http://5.175.7.57:96/api/",
    //"API_BASE_URI": "http://192.168.31.229:8011/api/",
    //"API_BASE_URI": "http://192.168.31.229:99/api/",
    //"API_BASE_URI": "https://www.tmsportal.de/TMS.Apide/api/",
    //"API_BASE_URI": "http://5.175.7.57/TMS.Apistg/api/",
    "DEFAULT_PAGE_SIZE": "12"
});


function getTokenInfo() {
     var name = "tokenInfo=";
     var ca = document.cookie.split(';');
     for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
var TimezoneOffset = -(new Date().getTimezoneOffset());

(function () {
    'use strict';

    tmsApp.controller('tmsAppController', function ($scope, $rootScope, $window, $location) {
        var vm = $scope;
        $scope.tokenInfo = {};
        vm.message = "Tms app controller";
        $rootScope.pageInfo = {
            pageHeader: null,
            pageDescription: null,
        };
        

        //if ($window.sessionStorage["tokenInfo"]) {
        var TokenInfo=getTokenInfo();
        if(TokenInfo!=""){
            var tokenInfo = JSON.parse(TokenInfo)
            vm.tokenInfo = JSON.parse(getTokenInfo());
            if (tokenInfo && tokenInfo.Token) {
                $rootScope.companyId = tokenInfo.CompanyId;
                $rootScope.isUserAuthenticated = true;
            }
        } else {
            $rootScope.isUserAuthenticated = false;
        }

        vm.doLogout = function () {
            //$window.sessionStorage["tokenInfo"] = null;
            // delete $window.sessionStorage["tokenInfo"];
            document.cookie = "tokenInfo=" + "";
            $rootScope.isUserAuthenticated = false;
            $location.path('/login');
        }

        vm.activeClass = function (path) {
            return ($location.path().substr(0, path.length) === path) ? 'active' : '';
        }
    });
    tmsApp.directive('fileUpload', function () {
        return {
            scope: true,        //create a new scope
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var files = event.target.files;
                    //iterate files since 'multiple' may be specified on the element
                    for (var i = 0; i < files.length; i++) {
                        //emit event upward
                        scope.$emit("fileSelected", { file: files[i] });
                    }
                });
            }
        };
    });
})();

