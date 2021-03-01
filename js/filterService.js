(function () {
    'use strict';

    tmsApp.factory('filterService', function (APP_SETTINGS) {
        var setttings = APP_SETTINGS;
        var defaultFilter = {
            "PageIndex": "1",
            "PageSize": APP_SETTINGS.DEFAULT_PAGE_SIZE,
            "OrderBy": "Id",
            "SortOrder": 2
        };

        return {
            getFilter: function (filter) {
                var retValFilter = angular.copy(defaultFilter);
                if (filter) {
                    retValFilter.PageIndex = filter.PageIndex;
                    retValFilter.PageSize = filter.PageSize;
                    retValFilter.OrderBy = filter.OrderBy;
                    retValFilter.SortOrder = filter.SortOrder;
                }
                return retValFilter;
            },

            getFilterString: function (filter) {
                var filterObj = this.getFilter(filter);
                var filterString = "pageSize=" + filterObj.PageSize + "&pageIndex=" + filterObj.PageIndex + "&orderBy=" + filterObj.OrderBy + "&orderDir=" + filterObj.SortOrder;
                return filterString;
            },

            getAdvanceFilterString: function (obj) {
                var str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                return str.join("&");
            }

        }
    });
})();