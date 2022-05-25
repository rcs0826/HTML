/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    

    ordernewcontroller.$inject = [
        '$stateParams',
        'totvs.app-main-view.Service',
        'customization.generic.Factory',
        'mpd.fchdis0051.Factory',  
        '$filter'];

    function ordernewcontroller(
            $stateParams, 
            appViewService, 
            customService,
            fchdis0051,
            $filter) {
		
        var newController = this;

        var i18n = $filter('i18n');
        
        newController.orderId = $stateParams.orderId;
        newController.idiModel = $stateParams.idiModel;
        newController.nrPedcli = $stateParams.nrPedcli;
        newController.codEmit = $stateParams.codEmit;

        fchdis0051.getParameters(function result(result) {

            customService.callCustomEvent("getParametersNew", {
                controller:newController,
                result: result 
            });            
            newController.orderParameters = result.ttOrderParameters[0];
            
            newController.permissions = {
                'ped-venda-add' : [],
                'ped-venda-edit' : [],
                'ped-item-add-edit' : [],
                'ped-item-child' : [],
                'ped-item-fastadd' : [],
                'ped-item-grid' : [],
                'ped-item-search' : [],
                'ped-repre' : [],
                'ped-ent' : [],
                'ped-repres-item' : [],
                'ped-saldo' : [],
                'pd4000' : [],
                'carteira-pedidos': []
            }

            for (var i = 0; i < result.ttVisibleFieldsPD4000.length; i++) {
                var field = result.ttVisibleFieldsPD4000[i];
                newController.permissions[field.screenName].push(field);
            }
        });            
        
        
        appViewService.startView(i18n('Pedido',[],'dts/mpd') + " " + newController.orderId);
        
    }
    index.register.controller('salesorder.pd4000.NewController', ordernewcontroller);
        
});
