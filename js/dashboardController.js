(function () {
    'use strict';

    tmsApp.controller('dashboardController', function ($scope, $rootScope, $location, customerService, ticketService, APP_SETTINGS, dashboardService, ngToast) {
        $rootScope.pageInfo = {
            pageTitle: Localization["Dashboard"],
            pageDescription: null,
        };
        $scope.tokenInfo = {};
        var vm = $scope;
        var tokenInfo = JSON.parse(getTokenInfo());
        vm.filterBy = 'customer';
        vm.tokenInfo = JSON.parse(getTokenInfo());
        //function test(){
        //    $scope.filteredTodos = []
        //  ,$scope.currentPage = 1
        //  ,$scope.numPerPage = 10
        //  ,$scope.maxSize = 5;
  
        //    $scope.makeTodos = function() {
        //        $scope.todos = [];
        //        for (i=1;i<=1000;i++) {
        //            $scope.todos.push({ text:'todo '+i, done:false});
        //        }
        //    };
        //    $scope.test();
  
        //    $scope.$watch('currentPage + numPerPage', function() {
        //        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        //        , end = begin + $scope.numPerPage;
    
        //        $scope.filteredTodos = $scope.todos.slice(begin, end);
        //    });
        //}
        
          $scope.currentPage = 1
          $scope.numPerPage = 10
        function getRecentTickets(filterBy, id) {
            vm.recentTickets = [];
            vm.filteredTodos = [],
            vm.currentPage = 1,
            vm.numPerPage = 10,
            vm.maxSize = 5;
            ticketService.getRecentTickets(filterBy, id)
                .success(function (data) {
                    for (var i = 0; i < data.Data.length; i++) {
                        data.Data[i].TicketCategory.Name = Localization[data.Data[i].TicketCategory.Name];
                        data.Data[i].TicketPriority.Name = Localization[data.Data[i].TicketPriority.Name];
                        data.Data[i].TicketSiteSize.Name = Localization[data.Data[i].TicketSiteSize.Name];
                        data.Data[i].TicketStatus.Name = Localization[data.Data[i].TicketStatus.Name];
                        data.Data[i].CreatedOn = new Date(new Date(data.Data[i].CreatedOn).getTime() + TimezoneOffset * 60 * 1000);
                        vm.recentTickets.push(data.Data[i]);
                    }
                    if (vm.filterBy == 'customer' && data.Data.length == 0) {
                        getCustomer(id);
                    }
                    

                    //$scope.maxSize = 5;
                    //$scope.$watch('currentPage + numPerPage', function () {
                    //    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    //    , end = begin + $scope.numPerPage;

                    //    //$scope.recentTickets = vm.recentTickets.slice(begin, end);
                    //});
                    
                })
                .error(function (err) {
                    ngToast.create({
                        className: 'danger',
                        content: LocalizationToast["ErrorRetriveingRecentTicket"],
                        dismissButton: true
                    });
                });
        }

        $scope.localtime = function (date) {
            date = new Date(date)
            var offset = new Date().getTimezoneOffset();
            return new Date(date.getTime() - (offset * 60 * 1000))
        }

        getRecentTickets("", 0);

        var getWidgetStats = function () {
            dashboardService.getWidgetStatistics()
            .success(function (data) {
                vm.widgetStats = data.Data;
            })
            .error(function (err) {
                ngToast.create({
                    className: 'danger',
                    content: LocalizationToast["ErrorRetriveingWidgetStatistics"],
                    dismissButton: true
                });
            });
        }

        getWidgetStats();

        $scope.doughnutChartColors = ['#448AFF', '#43A047', '#009688', '#E91E63'];
        var getTicketStatistics = function () {
            dashboardService.getTicketStatistics()
            .success(function (data) {
                vm.ticketStatistics = data.Data;
                for (var i = 0; i < vm.ticketStatistics.TicketStatus.length; i++) {
                    vm.ticketStatistics.TicketStatus[i] = Localization[vm.ticketStatistics.TicketStatus[i]];
                }
                $scope.data = data.Data.Count;
            })
            .error(function (err) {
                ngToast.create({
                    className: 'danger',
                    content: LocalizationToast["ErrorRetriveingTicketStatistics"],
                    dismissButton: true
                });
            });
        }

        getTicketStatistics();
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) { if (value % 1 === 0) { return value; } }
                        }
                    }
                ]
            },
            legend: { display: true }
        };
        $scope.barChartColors = ['#424242', '#43A047'];
        var getTicketYearlyStatistics = function () {
            dashboardService.getTicketYearlyStatistics()
            .success(function (data) {
                vm.ticketYearlyStatistics = data.Data;
                for (var i = 0; i < vm.ticketYearlyStatistics.Month.length; i++) {
                    vm.ticketYearlyStatistics.Month[i] = Localization[vm.ticketYearlyStatistics.Month[i]];
                }
            })
            .error(function (err) {
                ngToast.create({
                    className: 'danger',
                    content: LocalizationToast["ErrorRetriveingTicketStatistics"],
                    dismissButton: true
                });
            });
        }

        getTicketYearlyStatistics();

        //$scope.options = { legend: { display: true } };

        $scope.child = function () {
            console.log('child');
        }

        $scope.parent = function () {
            console.log('parent');
        }

        //$scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        //$scope.data = [300, 500, 100];

        //$scope.blabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        //$scope.bseries = ['Series A', 'Series B'];

        //$scope.bdata = [
        //  [65, 59, 80, 81, 56, 55, 40]];


        vm.getCustomers = function () {
            $(".js-customerfilter-ajax").select2({
                ajax: {
                    url: function () { return APP_SETTINGS.API_BASE_URI + "Customers/Search?pageSize=7&orderBy=Id&orderDir=ASC" },
                    dataType: 'json',
                    delay: 250,
                    headers: { "Authorization": "Bearer " + tokenInfo.Token },
                    data: function (params) {
                        return {
                            name: params.term, // search term
                            pageIndex: params.page,
                        };
                    },
                    processResults: function (data, params) {
                        params.pageIndex = params.pageIndex || 1;

                        var results = [];

                        $.each(data.Data, function (i, v) {
                            var o = {};
                            o.id = v.Id;
                            if (v.CustomerTypeId == 1 || v.CustomerTypeId == 3) {
                                o.name = v.Name;
                                o.value = v.Name;
                            }
                            else {
                                o.name = v.FirstName + " " + v.LastName;
                                o.value = v.FirstName;
                            }
                            results.push(o);
                        })
                        return {
                            results: results,
                            pagination: {
                                more: (params.pageIndex * 5) < data.Filter.Page.TotalRecords
                            }
                        };
                    },
                    cache: true
                },
                escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
                minimumInputLength: 0,
                templateResult: formatRepo, // omitted for brevity, see the source of this page
                templateSelection: formatRepoSelection, // omitted for brevity, see the source of this page,
            })
        };

        vm.getTechnicians = function () {
            $(".js-technicianfilter-ajax").select2({
                ajax: {
                    url: function () { return APP_SETTINGS.API_BASE_URI + "Technicians/Search?pageSize=7&orderBy=Id&orderDir=ASC" },
                    dataType: 'json',
                    delay: 250,
                    headers: { "Authorization": "Bearer " + tokenInfo.Token },
                    data: function (params) {
                        return {
                            name: params.term,
                            pageIndex: params.page
                        };
                    },
                    processResults: function (data, params) {
                        params.pageIndex = params.pageIndex || 1;

                        var results = [];

                        $.each(data.Data, function (i, v) {
                            var o = {};
                            o.id = v.Id;
                            o.name = v.FirstName + " " + v.LastName;
                            o.value = v.FirstName;
                            results.push(o);
                        })

                        return {
                            results: results,
                            pagination: {
                                more: (params.pageIndex * 5) < data.Filter.Page.TotalRecords
                            }
                        };
                    },
                    cache: true
                },              
                escapeMarkup: function (markup) { return markup; },
                minimumInputLength: 0,
                templateResult: formatRepo,
                templateSelection: formatRepoSelection
            });
        };
        vm.recentTickets = [];
        vm.ticket = {};
        vm.ticket.Customer = {};
        vm.ticket.Customer.Contacts = [];
        vm.ticket.Customer.Addresses = [];
        vm.FilterRecord = function (id) {
            getRecentTickets(vm.filterBy, id);
        }


        //////////////////edit customer ///////////////

        function getCustomer (customerId) {
            customerService.getCustomer(customerId).success(function (data) {
                var ticket = {};                
                ticket.Customer = data.Data;
                if (data.Data.CustomerTypeId == 1 || data.Data.CustomerTypeId == 3 || data.Data.CustomerTypeId == 5) {
                    ticket.ReportedByName = data.Data.Name;
                } else {
                    ticket.ReportedByName = data.Data.FirstName + " " + data.Data.LastName;
                }

                vm.recentTickets.push(ticket);                
            })
        }

        vm.getSalutations = function () {
            customerService.getSalutations().success(function (data) {
                vm.salutations = [];
                for (var i = 0; i < data.Data.length; i++) {
                    var salutation = {
                        Id: data.Data[i].Id,
                        Name: Localization[data.Data[i].Name]
                    }
                    vm.salutations.push(salutation);
                };
            })
        }();

        vm.getCustomerTypes = function () {
            customerService.getCustomerTypes().success(function (data) {
                vm.customerTypes = [];
                for (var i = 0; i < data.Data.length; i++) {
                    var customerType = {
                        Id: data.Data[i].Id,
                        Name: Localization[data.Data[i].Name]
                    }
                    vm.customerTypes.push(customerType);
                }
            })
        }();

        vm.getState = function (countryId) {
            customerService.getState(countryId).success(function (data) {
                $scope.states = data.Data;
            })
        };

        vm.getCountry = function () {
            customerService.getCountry().success(function (data) {
                $scope.countries = data.Data;
                vm.addressInfo.Country.Id = $scope.countries[0].Id;
                vm.countryName = $scope.countries[0].Name;
                vm.getState(vm.addressInfo.Country.Id);
            })
        }();

        vm.getCities = function (stateId) {
            customerService.getCity(stateId).success(function (data) {
                $scope.cities = data.Data;
            })
        };


        function formatRepo(repo) {
            if (repo.loading) {
                return repo.text;
            }

            var markup = repo.name;

            return markup;
        }

        function formatRepoSelection(repo) {
            return repo.name || repo.Id;
        }

        vm.TicketTypeChange = function (selectdVal) {            
            if (vm.filterBy != selectdVal) {
                getRecentTickets("", 0);
                vm.filterBy = selectdVal;
            }
        }
        vm.clearFilter = function (target) {
            if (target == 'customer'){
                vm.getCustomers();
            }                
            else {
                vm.getTechnicians();
            }
            getRecentTickets("", 0);
        }
        vm.addticketfromdashboard = function (customer)
        {
           
            $rootScope.Customer = customer;
            $location.path("/addEditTicket");
        }
        
       
    });
})();
