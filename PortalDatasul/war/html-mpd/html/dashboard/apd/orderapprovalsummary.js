/*global angular */
define(['index',  '/dts/mpd/js/userpreference.js', '/dts/mpd/js/api/fchdis0049.js', '/dts/mpd/js/portal-factories.js'], function(index) {

    orderAppSumCtrl.$inject = ['$rootScope', 'mpd.orderappsummaryapd.Factory', 'userPreference', '$filter', '$q', 'portal.getUserData.factory'];

    function orderAppSumCtrl($rootScope, orderappsummaryapd, userPreference, $filter, $q, userdata) {
        
        var orderAppSumController = this;
        this.summaryShow = true;
        orderAppSumController.emitente = " ";        
        
        $q.all().then(function () {                                                                                                                                                                                 
            orderAppSumController.loadData();                   
        });
               
        this.loadData = function (params) {
                       
            if($rootScope.selectedcustomer){
                orderAppSumController.emitente = $rootScope.selectedcustomer['cod-emitente'];;
            }else{
                orderAppSumController.emitente = " ";
            }             
            
            var params = {emitente: orderAppSumController.emitente};
                                                                                                             
             var select = orderappsummaryapd.orderApprovalSummary(params, function(values) {
                                                          
                if (values && values.length > 0){
                    orderAppSumController.orderPendAprov   = values[0]['quantity'];
                    orderAppSumController.orderAprovToday  = values[1]['quantity'];
                    orderAppSumController.orderReprovToday = values[2]['quantity'];
                }
                 orderAppSumController.summaryShow = true;                                                                                                                                                                                                     
             });                               
        };
        
        $rootScope.$on('selectedcustomer', function(event) {
            orderAppSumController.orderPendAprov = undefined;
            orderAppSumController.orderAprovToday = undefined;
            orderAppSumController.orderReprovToday = undefined;
            orderAppSumController.loadData();                                                                                                                                                                                                                                                                                   
        });
                        
        this.applyConfig = function() {            
            this.summaryShow = false;
            orderAppSumController.loadData();
        }
                                                                                                                                                                                                                                                                                                                                             
    }//function orderAppSumCtrl(loadedModules, userMessages)

    index.register.controller('apd.dashboard.orderappsummaryapd.Controller', orderAppSumCtrl);
                                                                                       
});