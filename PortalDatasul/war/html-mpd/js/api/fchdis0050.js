define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    shipmentFactory.$inject = ['$totvsresource'];
    function shipmentFactory($totvsresource) {
         
        var specificResources = {
            'getShipmentDashboard': {
                method: 'GET',
                isArray: true,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0050/getShipmentDashboard',
                params: {}, 
                headers: {noCountRequest: true }
            },
            'getShipment': {
                method: 'PUT',
                isArray: true,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0050/getShipment/:emitente/:max',
                params: {emitente: '@emitente', max: '@max', startAt: '@startAt', properties: '@properties', values: '@values'}
            },
            'getShipmentItens': {
                method: 'GET',
                isArray: true,                                
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0050/getShipmentItens/:cddEmbarq/:nrPedcli/:nomeAbrev',
                params: {cddEmbarq: '@cddEmbarq', properties: '@properties', values: '@values'}
            }
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0050', {}, specificResources);
         
        return factory;
    }
         
    index.register.factory('mpd.shipment.Factory', shipmentFactory);
   
    
});