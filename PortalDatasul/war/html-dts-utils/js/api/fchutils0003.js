define(['index',
        //'less!/dts/dts-utils/assets/css/deliverywindows.less'
       ], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    appsIntegFactory.$inject = ['$totvsresource'];
    function appsIntegFactory($totvsresource) {
         
        var specificResources = {
            'getAppsIntegList': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/integrationparameters'
            },
            'getSettings': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/integrationparameters/setting'
            },
            'newIntegration': {
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/integrationparameters'
            },
            'updateIntegration':	{
				method: 'PUT',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/integrationparameters'                
            }, 
            'deleteIntegration': {
                method: 'DELETE',
                isArray: false,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/integrationparameters/:integrationId'
            },
            'detailIntegration':	{
				method: 'GET',
                isArray: false,
                params: {integrationId: '@integrationId'},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/integrationparameters/:integrationId'                
            },
           'getApplicationParameters': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters'
            },
            'applicationParametersDataCharge': {
                method: 'POST',
                isArray: true,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/datacharge/:applicationId'
            }, 
            'applicationValidation': {
                method: 'POST',
                isArray: true,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/validation'
            },
            'createApplicationParameters': {
                method: 'POST',
                isArray: true,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/:applicationId'
            }, 
            'updateApplicationParameters': {
                method: 'POST',
                isArray: true,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/advancedupdate/:applicationId'
            }, 
            'deleteApplicationParameters': {
                method: 'DELETE',
                isArray: false,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/:applicationId'
            }, 
            'detailApplicationParameters': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/:applicationId'
            },             
            'copyApplicationParameters': {
                method: 'POST',
                isArray: true,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/advancedcopy/:applicationId'
            },
            'newExtraField': {
                method: 'POST',
                isArray: true,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/extrafields'
            }, 
             'zoomValidateExtraField': {
                 method: 'POST',
                 isArray: true,
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/extrafields/zoomvalidate'
             },
            'getExtraFields': {
                 method: 'GET',
                 isArray: false,
                 params: {},
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/extrafields'
             }, 
             'updateExtraField': {
                 method: 'POST',
                 isArray: true,
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/extrafields/updateExtraField'
             },
             'deleteExtraField': {
                 method: 'delete',
                 isArray: false,
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/extrafields/:extraFieldId'
             },
             'copyEntityApplication': {
                method: 'PUT',
                isArray: false,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/entitiesapplication/advancedcopy/:applicationId/:entityId'
             },
             'getEntityApplication': {
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/entitiesapplication'
             },
             'deleteEntityApplication': {
                method: 'DELETE',
                isArray: false,
                url: '/dts/datasul-rest/resources/prg/cdp/v1/entitiesapplication/:entityId'
             },
             'newEntity': {
                 method: 'POST',
                 isArray: true,
                 params: {},
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/entitiesapplication'
             },
             'updateEntity':	{
                 method: 'POST',
                 isArray: true,
                 params: {},
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/entitiesapplication/advancedupdate'                
             },
             'dataChargeSingleEntity': {
                 method: 'POST',
                 isArray: true,
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/entitiesapplication/datachargeentity/:applicationId/:entityId'
             },
             'updateApplicationEntityAndExtraFields': {
                 method: 'POST',
                 isArray: true,
                 url: '/dts/datasul-rest/resources/prg/cdp/v1/applicationparameters/updaterelatfields'
             }
        }
       
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchutils/fchutils0003', {}, specificResources);
         
        return factory;
    }
         
    index.register.factory('dts-utils.appsinteg.Factory', appsIntegFactory);
   
    
});