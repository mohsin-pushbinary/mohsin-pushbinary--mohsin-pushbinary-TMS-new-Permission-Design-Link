(function () {
    'use strict';
    tmsApp.controller('loginController', function ($scope, $rootScope, loginService, $location, $window, ngToast) {
        var vm = $scope;
        vm.message = Localization["Login Page"];
        vm.errors = null;
        vm.tab = { show: 1 };
        vm.user = {};
        vm.forgotPassword = function () {
            vm.tab.show = 1;
        }

        vm.doLogin = function () {
            loginService.validateUser(vm.user.username, vm.user.password, vm.remember)
                .success(function (data) {
                    var tokenInfo = data.Data;
                    if (tokenInfo && tokenInfo.Token) {
                        console.log("Valid User");
                        //$window.sessionStorage["tokenInfo"] = JSON.stringify(tokenInfo);
                        document.cookie = "tokenInfo=" + JSON.stringify(tokenInfo);
                        $rootScope.isUserAuthenticated = true;
                        $rootScope.companyId = tokenInfo.CompanyId;
                        
                        $location.path('/dashboard');

                       
                    }
                    else {
                        if (data && data.Message) {
                            vm.errors = [];
                            vm.errors[0] = Localization["doLoginInvalidCredentials"];
                        }
                    }
                })
                .error(function (err) {
                    //console.log("err: ", err);
                    //console.log("Invalid User");
                    vm.errors = [];
                    vm.errors[0] = Localization["doLoginInvalidCredentials"];
                });
        };

        vm.sendEmail = function () {
            loginService.forgotPassword(vm.user.forgotPasswordUserName)
            .success(function (data) {
                if (data.Message.MessageType == 3) {
                    vm.user.hasError = true;
                    vm.user.errorMsg = LocalizationToast["SendMailMessageType3"];
                    //ngToast.create({
                    //    className: 'danger',
                    //    content: LocalizationToast["SendMailMessageType3"],
                    //    dismissButton: true
                    //});
                }
                else if (data.Message.MessageType == 2) {
                    ngToast.create({
                        className: 'warning',
                        content: LocalizationToast["SendMailMessageType2"],
                        dismissButton: true
                    });
                }
                else if (data.Message.MessageType == 1) {
                    ngToast.create({
                        className: 'success',
                        content: LocalizationToast["SendMailMessageType1"],
                        dismissButton: true
                    });
                }
            })
            .error(function (error) {
                ngToast.create({
                    className: 'danger',
                    content: LocalizationToast["SendMailError"],
                    dismissButton: true
                });
            })
        }

        vm.resetError = function () {
            vm.user.hasError = false;
            vm.user.errorMsg = '';
        }
    });
})();