define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    factoryintegrationparams.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function factoryintegrationparams(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            getIntegrationParamsTT:{
                method: 'GET',
                isArray: false,
                params: {
                    url: 'integrationParamsTT'
                }
            },
            testAndSaveIntegrationParams:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'testAndSaveIntegrationParams'
                }
            },
            getDiretorioFormulas:{
                method: 'GET',
                isArray: false,
                params: {
                    url: 'getDiretorioFormulas'
                }
            },
            saveDefaultParameters:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveDefaultParameters'
                }
            },
            saveCellParameters:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'saveCellParameters'
                }
            },
            getCellParameters:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getCellParameters'
                }
            },
            getDefaultParameters:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getDefaultParameters'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbintegrationparams', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.integrationparams.Factory', factoryintegrationparams);
});
