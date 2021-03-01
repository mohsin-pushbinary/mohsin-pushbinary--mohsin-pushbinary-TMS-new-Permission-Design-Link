tmsApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: '../component/home', controller: 'homeController'
    }).
    when('/dashboard', {
        templateUrl: '../component/dashboard', controller: 'dashboardController'
    }).
    when('/contacts', {
        templateUrl: '../component/contact', controller: 'contactController'
    }).
    when('/about', {
        templateUrl: '../component/about', controller: 'aboutController'
    }).
    when('/login', {
        templateUrl: '../component/login', controller: 'loginController'
    }).
    when('/customers', {
        templateUrl: '../component/customer', controller: 'customerController'
    }).
    when('/inbox', {
        templateUrl: '../component/inbox', controller: 'inboxController'
    }).
    when('/technicians', {
        templateUrl: '../component/technician', controller: 'technicianController'
    }).
    when('/analytics', {
        templateUrl: '../component/analytics', controller: 'analyticsController'
    }).
    when('/tickets', {
        templateUrl: '../component/ticket', controller: 'ticketController'
    }).
    when('/userProfile', {
        templateUrl: '../component/userProfile', controller: 'userProfileController'
    }).
    when('/ticketDetails/:ticketId?', {
        templateUrl: '../component/ticketDetail', controller: 'ticketDetailController'
    }).
    when('/customerDetail/:customerId?', {
        templateUrl: '../component/customerDetail', controller: 'customerDetailController'
    }).
    when('/technicianDetails/:technicianId?', {
        templateUrl: '../component/technicianDetail', controller: 'technicianDetailController'
    }).
    when('/addEditCustomer/:customerId?', {
        templateUrl: '../component/addeditcustomer', controller: 'addEditCustomerController'
    }).
    when('/addEditTechnician/:technicianId?', {
        templateUrl: '../component/addedittechnician', controller: 'addEditTechnicianController'
    }).
    when('/addEditTicket/:ticketId?', {
        templateUrl: '../component/addeditticket', controller: 'addEditTicketController'
    }).
    when('/calendar/:ticketId?', {
        templateUrl: '../component/TechniciansSchedule', controller: 'techniciansScheduleController'
    }).
    when('/customerTicket/:customerId?', {
        templateUrl: '../component/customerticket', controller: 'customerTicketController'
    }).
    when('/technicianTickets/:technicianId?', {
        templateUrl: '../component/technicianticket', controller: 'technicianTicketController'
    }).
    when('/houseHolder/residents/:ownerId?', {
        templateUrl: '../component/Resident', controller: 'ResidentController'
    }).
    when('/thirdParty/residents/:ownerId?', {
        templateUrl: '../component/Resident', controller: 'ResidentController'
    }).
    when('/addsubagent', {
        templateUrl: '../component/addsubagent', controller: 'addsubagentController'
    }).
    when('/addcompanyofsubagent', {
        templateUrl: '../component/addcompanyofsubagent', controller: 'addsubagentController'
    }).
    when('/addEditTicketSubAgent/:ticketId?', {
        templateUrl: '../component/AddEditTicketSubAgent', controller: 'addEditTicketController'
    }).
    when('/companieslist', {
        templateUrl: '../component/companieslist', controller: 'addsubagentController'
    }).
    when('/allsubagents', {
        templateUrl: '../component/allsubagents', controller: 'addsubagentController'
    }).
    when('/editsubagent/:userId?', {
        templateUrl: '../component/editsubagent', controller: 'editsubagentController'
    }).

    otherwise({
        redirectTo: '/dashboard'
    });
}]);

tmsApp.config(['$httpProvider', function ($httpProvider) {
    // Add interceptors.
    $httpProvider.interceptors.push('tmsInterceptor');
}]);