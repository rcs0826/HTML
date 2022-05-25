/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/dbo/dbo.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsuni
     # Table...: layout_extrat
     # Factory.: cmg900wcFactory
     # Register: cmg.cmg900wc.Factory
     ####################################################################################################*/
    function cmg900wcFactory($totvsresource, dboFactory) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cmg/cmg900wc/:method//:id');

        angular.extend(factory, dboFactory);

        return factory;

    }

    cmg900wcFactory.$inject = ['$totvsresource', 'dts-utils.dbo.Factory'];
    index.register.factory('cmg.cmg900wc.Factory', cmg900wcFactory);

});
