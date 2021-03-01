
(function () {
    'use strict';

    tmsApp
    .factory('tmsInterceptor', ['$q', '$window', '$rootScope', '$location', tmsInterceptor])

    function tmsInterceptor($q, $window, $rootScope, $location) {
        return {
            // On request success
            request: function (config) {
                console.log(config); // Contains the data about the request before it is sent.

                // Authorizatin Header.
                              
                // if ($window.sessionStorage["tokenInfo"]) {
                var TokenInfo = getTokenInfo();
                if (TokenInfo != "") {
                    var tokenInfo = JSON.parse(TokenInfo)                   
                    if (tokenInfo && tokenInfo.Token) {
                        if (!$rootScope.userInfo)
                            $rootScope.userInfo = { displayName: "" }
                        $rootScope.userInfo.displayName = tokenInfo.DisplayName;
                        config.headers.authorization = "Bearer " + tokenInfo.Token;
                        config.headers.TimeZoneOffset = TimezoneOffset;
                    }
                }

                //var sessionInfo = sessionService.getCurrentUser();
                //if (sessionInfo && sessionInfo.token) {
                //    config.headers.authorization = "bearer " + sessionInfo.token;
                //}

                //console.log(sessionInfo);
                //console.log(config.headers.authorization);

                //// Return the config or wrap it in a promise if blank.
                //$('#tms-loading').show();

                if (!$rootScope.isUserAuthenticated) {
                    $location.path('/login');
                }
                return config || $q.when(config);
            },

            // On request failure
            requestError: function (rejection) {
                //console.log(rejection); // Contains the data about the error on the request.
                //$('#tms-loading').hide();
                //// Return the promise rejection.
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                //// console.log(response); // Contains the data from the response.
                //$('#tms-loading').hide();
                //// Return the response or promise.
                return response || $q.when(response);
            },

            // On response failture
            responseError: function (rejection) {
                //console.log(rejection); // Contains the data about the error.
                //$('#tms-loading').hide();

                if (rejection.status === 401) {
                    $rootScope.isUserAuthenticated = false;
                    document.cookie = "tokenInfo=" + "";
                    $location.path('/login');
                    $q.reject(rejection);
                }

                // Return the promise rejection.
                return $q.reject(rejection);
            }
        };
    }
})();