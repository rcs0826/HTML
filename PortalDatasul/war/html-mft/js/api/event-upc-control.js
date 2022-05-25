define(['index', ], function (index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    factory.$inject = ['$totvsresource'];

    function factory($totvsresource) {

        var resources = {
            'getProgram': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/eventupccontrol/getProgram/'
            },
            'getEvent': {
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/eventupccontrol/getEvent/'
            },
            'createUpdateProgramEvent': {
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/eventupccontrol/createUpdateProgramEvent/'
            },
            'deleteProgram': {
                method: 'DELETE',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/prg/ftp/v1/eventupccontrol/deleteProgram/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/prg/ftp/v1/eventupccontrol', {}, resources);
        return factory;
    }

    index.register.factory('mft.event-upc-control.Factory', factory);

});