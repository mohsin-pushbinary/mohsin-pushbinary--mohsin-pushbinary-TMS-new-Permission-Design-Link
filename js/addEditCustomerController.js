(function () {
    'use strict'

    tmsApp.controller('addEditCustomerController', function (APP_SETTINGS, $scope,addsubagentService, $rootScope, $uibModal, $routeParams, $location, ngToast, customerService, filterService) {
        $rootScope.pageInfo = {
            pageTitle: Localization["Add/Edit Customer"],
            pageDescription: null,
        };

        var vm = $scope;
        var tokenInfo = JSON.parse(getTokenInfo());
        vm.fileApiUri = APP_SETTINGS.API_BASE_URI + "/Files/File?filePath="
        vm.customerId = ($routeParams.customerId) ? $routeParams.customerId : 0;        
        vm.addressInfo = {};
        vm.addressInfo.Country = {};

        vm.getHouseHolder = function (Id, Name) {
            $(".householder-ajax").select2({
                ajax: {
                    url: function () { return APP_SETTINGS.API_BASE_URI + "Customers/Search?pageSize=7&orderBy=Id&orderDir=ASC" },
                    dataType: 'json',
                    delay: 250,
                    headers: { "Authorization": "Bearer " + tokenInfo.Token },
                    data: function (params) {
                        return {
                            name: params.term,
                            pageIndex: params.page,
                            customerTypeId: 1
                        };
                    },
                    processResults: function (data, params) {
                        params.pageIndex = params.pageIndex || 1;
                        var results = [];
                        $.each(data.Data, function (i, v) {
                            var o = {};
                            o.id = v.Id;
                            o.name = v.Name;
                            o.value = v.Name;
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
                initSelection: function (element, callback) {
                    return callback({ id: Id, name: Name });
                },
                escapeMarkup: function (markup) { return markup; },
                minimumInputLength: 1,
                templateResult: formatRepo,
                templateSelection: formatRepoSelection,
            })
            $('.householder-ajax').next('.select2').find('.select2-selection').one('focus', select2Focus);
            function select2Focus() {
                vm.genInfoForm.reportedBy.$error = true;
                $(this).closest('.select2').prev('select').select2('open');
            }
        };

        vm.getThirdParty = function (Id, Name) {
            $(".thirdparty-ajax").select2({
                ajax: {
                    url: function () { return APP_SETTINGS.API_BASE_URI + "Customers/Search?pageSize=7&orderBy=Id&orderDir=ASC" },
                    dataType: 'json',
                    delay: 250,
                    headers: { "Authorization": "Bearer " + tokenInfo.Token },
                    data: function (params) {
                        return {
                            name: params.term,
                            pageIndex: params.page,
                            customerTypeId: 3
                        };
                    },
                    processResults: function (data, params) {
                        params.pageIndex = params.pageIndex || 1;
                        var results = [];
                        $.each(data.Data, function (i, v) {
                            var o = {};
                            o.id = v.Id;
                            o.name = v.Name;
                            o.value = v.Name;
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
                initSelection: function (element, callback) {
                    return callback({ id: Id, name: Name });
                },
                escapeMarkup: function (markup) { return markup; },
                minimumInputLength: 1,
                templateResult: formatRepo,
                templateSelection: formatRepoSelection,
            })
            $('.thirdparty-ajax').next('.select2').find('.select2-selection').one('focus', select2Focus);
            function select2Focus() {
                vm.genInfoForm.reportedBy.$error = true;
                $(this).closest('.select2').prev('select').select2('open');
            }
        };

        vm.openAddResidentModal = function () {
            var Customer = {
                CustomerType: "Resident",
                OwnerId: vm.customerId,
                OwnerName: vm.genInfo.HouseHolderName
            }
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '../component/AddCustomerModal',
                controller: 'addCustomerModalController',
                resolve: {
                    Customer: function () {
                        return Customer;
                    }
                }
            });
        };

        vm.openAddWorkerModal = function () {
            var Worker = {
                OwnerId: vm.customerId,
                OwnerName: vm.genInfo.HouseHolderName
            }
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '../component/AddWorkerModal',
                controller: 'addWorkerModalController',
                resolve: {
                    Worker: function () {
                        return Worker;
                    }
                }
            });
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

        //listen for the file selected event
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                //add the file object to the scope's files collection
                $scope.files = [];
                $scope.file = (args.file);
                $scope.files.push($scope.file);
                validateDocument();
                //$scope.files.push(args.file);
            });
        });

        $scope.file = {};
        $scope.files = [];

        $scope.upload = {}
        var fileNameRegex = "^[^~\\/*?\"<>|]+$";

        var validFileExtensions = [".jpg", ".tif", ".jpeg", ".bmp", ".gif", ".png", ".pdf"];
        $scope.documentValidation = {
            isValidFileSize: true,
            isValidFileNameLength: true,
            isValidFileName: true,
            isValidFileType: true
        }
        var maxSize = 2097152;
        $scope.disableUploadArea = false;

        var validateDocument = function () {
            $scope.documentValidation = {
                isValidFileSize: true,
                isValidFileNameLength: true,
                isValidFileName: true,
                isValidFileType: true
            }
            var fileName = $scope.file.name;
            if (fileName.length > 100)
                $scope.documentValidation.isValidFileNameLength = false;
            var blnValid = false;
            for (var j = 0; j < validFileExtensions.length; j++) {
                var sCurExtension = validFileExtensions[j];
                if (fileName.substr(fileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() === sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }
            if (!blnValid)
                $scope.documentValidation.isValidFileType = false;
            if ($scope.file.size == undefined || $scope.file.size > maxSize)
                $scope.documentValidation.isValidFileSize = false;
            var re = new RegExp(fileNameRegex);
            if (!re.test(fileName))
                $scope.documentValidation.isValidFileName = false;
        }

        vm.filter = filterService.getFilter();

        //vm.getGenders = function () {
        //    customerService.getGenders().success(function (data) {
        //        vm.genders = [];
        //        for (var i = 0; i < data.Data.length; i++) {
        //            var gender = {
        //                Id: data.Data[i].Id,
        //                Name: Localization[data.Data[i].Name]
        //            }
        //            vm.genders.push(gender);
        //        }
        //    })
        //}();

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

        vm.getCustomer = function () {
            customerService.getCustomer(vm.customerId).success(function (data) {
                vm.genInfo = data.Data;
                if (vm.genInfo != null) {
                    if (data.Data.Contacts.length > 0) {
                        vm.contactInfo = vm.genInfo.Contacts[0];
                        
                    }
                    if (data.Data.Addresses.length > 0) {
                        vm.addressInfo = vm.genInfo.Addresses[0];
                        vm.getState(vm.addressInfo.Country.Id);
                        vm.getCities(vm.addressInfo.State.Id);
                        vm.getcompanyNamex(vm.addressInfo.Zip)

                        if (vm.addressInfo.City.IsUserCreated) {
                            vm.addressInfo.CustomCity = {};
                            vm.addressInfo.CustomCity.Name = vm.genInfo.Addresses[0].City.Name;
                            vm.addressInfo.CustomCity.Id = vm.genInfo.Addresses[0].City.Id;
                            vm.addressInfo.City.Id = 0;
                        }
                    }
                    if (vm.genInfo.CustomerTypeId == 2 && vm.genInfo.HouseHolder != undefined) {
                        vm.getHouseHolder(vm.genInfo.HouseHolder.Id, vm.genInfo.HouseHolder.Name);
                    }
                    else if (vm.genInfo.CustomerTypeId == 4) {
                        vm.getThirdParty(vm.genInfo.ThirdParty.Id, vm.genInfo.ThirdParty.Name);
                    }
                }
                else {
                    vm.getHouseHolder();
                    vm.getThirdParty();
                }                
            })
        }();

        vm.saveCustomerInfo = function (genInfo, contactInfo, addressInfo) {
            var CustomerInfo = genInfo;
            CustomerInfo.Id = vm.customerId;
            CustomerInfo.Contacts = [];
            CustomerInfo.Contacts.push(contactInfo);
            CustomerInfo.Addresses = [];
            if (addressInfo.City.Id) {
                angular.forEach($scope.cities, function (item, index) {
                    if (item.Id == addressInfo.City.Id)
                        addressInfo.City.Name = item.Name;
                })
            }
            if (addressInfo.State.Id) {
                angular.forEach($scope.states, function (item, index) {
                    if (item.Id == addressInfo.State.Id)
                        addressInfo.State.Name = item.Name;
                })
            }
            if (addressInfo.Country.Id) {
                angular.forEach($scope.countries, function (item, index) {
                    if (item.Id == addressInfo.Country.Id)
                        addressInfo.Country.Name = item.Name;
                })
            }
            CustomerInfo.Addresses.push(addressInfo);
            vm.SubmitInProcess = true;
            customerService.saveCustomerInfo(CustomerInfo, $scope.file).success(function (data) {
                vm.customerId = data.Data.CustomerId;
                vm.contactInfo.Id = data.Data.ContactId;
                vm.addressInfo.Id = data.Data.AddressId;
                ngToast.create({
                    className: 'success',
                    content: LocalizationToast["GeneralInfoSavedSuccessfully"],
                    dismissButton: true
                });
                $location.path("/customerDetail/" + vm.customerId);
            }).error(function (err) {
                vm.SubmitInProcess = false;
                ngToast.create({
                    className: 'danger',
                    content: LocalizationToast["ErrorSavingGeneralInfo"],
                    dismissButton: true
                });
            });
            
        };
        vm.saveCustomerInfoaddticket = function (genInfo, contactInfo, addressInfo) {
            var CustomerInfo = genInfo;
            CustomerInfo.Id = vm.customerId;
            CustomerInfo.Contacts = [];
            CustomerInfo.Contacts.push(contactInfo);
            CustomerInfo.Addresses = [];
            if (addressInfo.City.Id) {
                angular.forEach($scope.cities, function (item, index) {
                    if (item.Id == addressInfo.City.Id)
                        addressInfo.City.Name = item.Name;
                })
            }
            if (addressInfo.State.Id) {
                angular.forEach($scope.states, function (item, index) {
                    if (item.Id == addressInfo.State.Id)
                        addressInfo.State.Name = item.Name;
                })
            }
            if (addressInfo.Country.Id) {
                angular.forEach($scope.countries, function (item, index) {
                    if (item.Id == addressInfo.Country.Id)
                        addressInfo.Country.Name = item.Name;
                })
            }
            CustomerInfo.Addresses.push(addressInfo);
            vm.SubmitInProcess = true;
            customerService.saveCustomerInfo(CustomerInfo, $scope.file).success(function (data) {
                vm.customerId = data.Data.CustomerId;
                vm.contactInfo.Id = data.Data.ContactId;
                vm.addressInfo.Id = data.Data.AddressId;
                ngToast.create({
                    className: 'success',
                    content: LocalizationToast["GeneralInfoSavedSuccessfully"],
                    dismissButton: true
                });
                $rootScope.cstid = vm.customerId;
                $rootScope.cstgeninfo = genInfo;

                document.getElementById("redirecttoaddEditTicket").click();
                //$location.path("/addEditTicket?customerid=" + vm.customerId);
            }).error(function (err) {
                vm.SubmitInProcess = false;
                ngToast.create({
                    className: 'danger',
                    content: LocalizationToast["ErrorSavingGeneralInfo"],
                    dismissButton: true
                });
            });
            
        };

        $scope.cancleSelection = function () {
            $scope.file = {};
            $scope.files = [];
            document.getElementById("profileImage").value = "";
        }

        vm.getcompanyNamex = function (zipcode) {
            addsubagentService.getcompanyName(zipcode).success(function (data) {
                $scope.companiesofzipcode = data.response;

            })
        }

    });

})();
