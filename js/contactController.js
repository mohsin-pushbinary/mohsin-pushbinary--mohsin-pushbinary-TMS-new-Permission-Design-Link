(function () {
    'use strict';

    tmsApp.controller('contactController', function ($scope, $rootScope, contactService) {
        $rootScope.pageInfo = {
            pageTitle: Localization["Contacts"],
            pageDescription: null,
        };
        var vm = $scope;
        vm.editData = function (editType) {
            if (editType == 'edit') {
                vm.contact = true;
            }
            else {
                vm.contact = false;
            }
            console.log(vm.contact)
        }

        contactService.getContacts()
        .then(function (data) {
            vm.contacts = data;
            console.log("contacts:", data);
        });
    });
})();