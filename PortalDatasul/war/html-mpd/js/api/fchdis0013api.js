define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    paramPortalFactory.$inject = ['$totvsresource'];
    function paramPortalFactory($totvsresource) {
         
        var specificResources = {
            'getRecordParam': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api/getRecordParam'
            },
            'saveRecordParam': {
                method: 'PUT',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api/saveRecordParam',
            },
            'enableQuotatioGeneralLevel': {
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api/enableQuotatioGeneralLevel',
            },
            'getActivitiesWorkFlow': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api/getActivitiesWorkFlow'
            },
            'getActivitiesWorkFlowCancelPed': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api/getActivitiesWorkFlowCancelPed'
            },
            'checkRequests': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api/checkRequests'
            },
            'enableSalesChannelGeneralLevel': {
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api/enableSalesChannelGeneralLevel',
            }
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0013api',{}, specificResources);
         
        return factory;
    }    
         
    index.register.factory('mpd.paramportal.Factory', paramPortalFactory);
});