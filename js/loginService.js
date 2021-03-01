(function () {
    'use strict'

    tmsApp.service('loginService', function (APP_SETTINGS, $http) {
        this.validateUser = function (username, password, remember) {
            // Test Validation.
            var apiUrl = APP_SETTINGS.API_BASE_URI + "Account/LoginUser";
            var loginInfo = { userName: username, password: password };
            return $http.post(apiUrl, loginInfo);
        };

        this.forgotPassword = function (username) {
            var apiUrl = APP_SETTINGS.API_BASE_URI + "Account/ResetPassword" + "?userName=" + username;
            return $http.get(apiUrl);
        }

    });
})();