define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/controller/abiAnalysisAttendanceListController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceMaintenanceController.js',
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-abiAnalysisAttendance', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-abiAnalysisAttendance.start', {
                url: '/dts/hgp/hrs-abiAnalysisAttendance/:cddRessusAbiDados/:codAbi/:codProcesso',
                controller: 'hrs.abiAnalysisAttendanceList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/ui/abiAnalysisAttendanceList.html'
            })
            
            .state('dts/hgp/hrs-abiAnalysisAttendance.justification', {
                url: '/dts/hgp/hrs-abiAnalysisAttendance/justification/:cddRessusAbiDados/:cdProtocoloAih',
                controller: 'hrs.abiAnalysisAttendJustification.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceJustification.html'
            })

            .state('dts/hgp/hrs-abiAnalysisAttendance.declaration', {
                url: '/dts/hgp/hrs-abiAnalysisAttendance/declaration/:cddRessusAbiDados/:cdProtocoloAih',
                controller: 'hrs.abiAnalysisAttendanceRelDeclaController.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceRelDecla.html'
            })            

            .state('dts/hgp/hrs-abiAnalysisAttendance.maintenance', {
                url: '/dts/hgp/hrs-abiAnalysisAttendance/maintenance/:cddRessusAbiAtendim/:codAbi/:codProcesso',
                controller: 'hrs.abiAnalysisAttendanceMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceMaintenance.html'
            });  
});


