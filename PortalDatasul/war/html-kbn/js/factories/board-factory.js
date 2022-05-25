define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    factoryboards.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function factoryboards(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            boards:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'boards'
                }
            },
            getCellItems: {
                method: 'GET',
                isArray: true,
                params: {
                    url: 'getCellItems'
                }
            },
            startAndon:{
                method: 'GET',
                isArray: false,
                params: {
                    url:'startAndon'
                }
            },
            stopAndon:{
                method: 'GET',
                isArray: false,
                params: {
                    url:'stopAndon'
                }
            },
            getAndon:{
                method: 'GET',
                isArray: false,
                params: {
                    url:'andon'
                }
            },
            fila:{
                method: 'GET',
                isArray: true,
                params: {
                    url:'fila'
                }
            },
            itensProduz:{
                method: 'GET',
                isArray: true,
                params: {
                    url:'itensProduz'
                }
            },
            sendItemToQueue:{
                method: 'GET',
                isArray: false,
                params: {
                    url:'sendItemToQueue'
                }
            },
            filaProgramacao:{
                method: 'GET',
                isArray: true,
                params: {
                    url:'filaProgramacao'
                }
            },
            infoCelula:{
                method: 'GET',
                isArray: false,
                params: {
                    url:'infoCelula'
                }
            },
            producaoCelula:{
                method: 'GET',
                isArray: true,
                params: {
                    url:'producaoCelula'
                }
            },
            supermarketstatus:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'supermarketstatus'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbboard', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.boards.Factory', factoryboards);
});
