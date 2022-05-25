define(['index'], function(index) {
    // **************************************************************************************
    // ******************************** FACTORIES *******************************************
    // **************************************************************************************
    factoryPortalOrdersManager.$inject = ['$totvsresource'];
    function factoryPortalOrdersManager($totvsresource, genericService) {

        var specificResources = {
            'getOrderItems': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/orderItems/:nrPedido'
            },
            'deleteOrder': {
                method: 'PUT',
                isArray: false,                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/deleteSelectedOrder'
            },
            'portalOrdersSanitize': {
                method: 'DELETE',
                isArray: false,                
                params: {eliminaPedCancel: '@eliminaPedCancel', eliminaPedNaoLib: '@eliminaPedNaoLib', dtEmissao: '@dtEmissao', diasSemLib: '@diasSemLib', dtInicial: '@dtInicial', nomeAbrev: '@nomeAbrev'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/portalOrdersSanitize/:eliminaPedCancel/:eliminaPedNaoLib/:dtEmissao/:diasSemLib/:dtInicial/:nomeAbrev'
            },
            'taskOptions': {
                method: 'PUT',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/taskOptions',
                params: {nrPedCli: '@nrPedCli', nomeAbrev: '@nomeAbrev'}                
            },
            'loadUser': {
                method: 'PUT',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/loadUser/:selecao',
                params: {selecao: '@selecao'}
            },
            'saveAndSendTask': {
                method: 'PUT',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/saveAndSendTask'
            },'paramWorkflowActive': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/paramWorkflowActive'
            },'approveOrderCancelationWhitoutWorkflow': {
                method: 'PUT',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/approveOrderCancelationWhitoutWorkflow',
                params: {approve: '@approve'}
            },
            'getCommentRepres': {
                method: 'GET',
                isArray: true,
                params: {nrPedido: '@nrPedido'},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047/commentRepres/:nrPedido'
            },
            
        };

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0047', {}, specificResources);

        return factory;
    }
    index.register.factory('salesorder.portalordersmanager.Factory', factoryPortalOrdersManager);    

});