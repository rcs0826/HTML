define(['index', ], function (index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    factory.$inject = ['$totvsresource'];

    function factory($totvsresource) {

        var resources = {
            'getTag': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/documenttagconfig'
            },
            'getRuleRange': {
                method: 'GET',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/documenttagconfig/getRuleRange'
            },
            'createUpdateTag': {
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/documenttagconfig/createUpdateTag'
            },
            'createUpdateRuleRange': {
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/documenttagconfig/createUpdateRuleRange'
            },
            'deleteTag': {
                method: 'DELETE',
                isArray: false,
                params: {cdnDoctoTag: '@cdnDoctoTag'},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/documenttagconfig/deleteTag/'
            },
            'deleteRuleRange': {
                method: 'DELETE',
                isArray: false,
                params: {cdnDoctoTagRegra: '@cdnDoctoTagRegra'},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/documenttagconfig/deleteTagRegra/'
            },
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0063', {}, resources);
        return factory;
    }

    index.register.factory('mft.document-tag-config.Factory', factory);

});