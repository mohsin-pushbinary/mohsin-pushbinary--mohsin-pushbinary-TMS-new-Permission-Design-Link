(function () {
    'use strict';

    tmsApp.service('contactService', function (APP_SETTINGS, $http, filterService) {
        this.getContacts = function (filter) {
            var apiUrl = APP_SETTINGS.API_BASE_URI + "Contacts?" + filterService.getFilterString(filter);

            return $http.get(apiUrl)
                .then(function successCallback(response) {
                    console.log("GetContactResponse: ", response);
                    return response.data;
                }, function errorCallback(response) {
                    console.log(response);
                });
        }
    });
})();