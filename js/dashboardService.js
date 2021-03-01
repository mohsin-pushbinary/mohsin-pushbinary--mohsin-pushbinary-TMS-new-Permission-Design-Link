(function () {
    'use strict';

    tmsApp.service('dashboardService', function (APP_SETTINGS, $http, filterService) {

        this.getWidgetStatistics = function (filter) {
            var apiUrl = APP_SETTINGS.API_BASE_URI + "Dashboard/Widget";
            return $http.get(apiUrl);
        }

        this.getTicketStatistics = function (filter) {
            var apiUrl = APP_SETTINGS.API_BASE_URI + "Dashboard/TicketStatistics";
            return $http.get(apiUrl);
        }

        this.getTicketYearlyStatistics = function (filter) {
            var apiUrl = APP_SETTINGS.API_BASE_URI + "Dashboard/TicketYearlyStatistics";
            return $http.get(apiUrl);
        }
        
    });


})();