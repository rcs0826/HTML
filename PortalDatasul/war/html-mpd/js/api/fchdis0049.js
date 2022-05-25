define(['index'], function(index) {
    // *************************************************************************************
    // ******************************* FACTORIES *******************************************
    // *************************************************************************************
    orderAppSumFactory.$inject = ['$totvsresource'];
    function orderAppSumFactory($totvsresource) {
         
        var specificResources = {
            'orderApprovalSummary': {
                method: 'GET',
                isArray: true,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0049/orderApprovalSummary/:emitente',
                params: {emitente: '@emitente'},
                headers: {noCountRequest: true }
            },
            'searchApprovalOrderItem': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0049/searchApprovalOrderItem/:nrPedido'
            },
            'getTaskOptions': {
                method: 'GET',
                isArray: true,
                params: {processInstanceId: '@processInstanceId', movementSequence: '@movementSequence', sourceThreadSequence: '@sourceThreadSequence'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0049/getTaskOptions/:processInstanceId/:movementSequence/:sourceThreadSequence'
            },
            'loadUser': {
                method: 'GET',
                isArray: true,                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0049/loadUser/:processInstanceId/:sourceThreadSequence/:numberIdTableStates',
                params: {processInstanceId: '@processInstanceId', sourceThreadSequence: '@sourceThreadSequence', numberIdTableStates: '@numberIdTableStates'}
            },
            'saveAndSendTask': {
                method: 'GET',
                isArray: false,                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0049/saveAndSendTask/:nrPedCli/:nomeAbrev/:observacao/:usuario/:opcao/:idStates',
                params: {nrPedCli: '@nrPedCli',
                         nomeAbrev: '@nomeAbrev',
                         observacao: '@observacao',
                         usuario: '@usuario',
                         opcao: '@opcao',                         
                         idStates: '@idStates'}
            }
                                    
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0049',{}, specificResources);
         
        return factory;
    }
         
    index.register.factory('mpd.orderappsummaryapd.Factory', orderAppSumFactory);
   
    
});