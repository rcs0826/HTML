define(['index', '/dts/kbn/js/factories/kbn-factories.js'], function(index) {

    formulafactory.$inject = ['kbn.helper.FactoryLoader', 'kbn.generic.Factory', 'kbn.generic-crud.Factory', 'kbn.typeahead.Factory'];

    function formulafactory(factoryResource, kbnGenericFactory, kbnGenericCrud, typeaheadFactory) {

        var specificResources  = {

            getFormulas:{
                method: 'GET',
                isArray: true,
                params: {
                    url: 'formula'
                }
            },
            saveFormulas:{
                method: 'POST',
                isArray: false,
                params: {
                    url: 'formula'
                }
            },
            deleteFormula: {
                method: 'POST',
                isArray: false,
                params: {
                    url: 'deleteFormula'
                }
            },
            calcFormula: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'calcFormula'
                }
            }
        };

        var factory = factoryResource.loadSpecificResources('/dts/datasul-rest/resources/api/fch/fchkb/fchkbformula', specificResources);
        angular.extend(factory, kbnGenericFactory);
        angular.extend(factory, kbnGenericCrud);
        angular.extend(factory, typeaheadFactory);
        return factory;
    }
    index.register.factory('kbn.formula.Factory', formulafactory);
});
