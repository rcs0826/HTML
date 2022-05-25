/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/dbo/dbo.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsfin
     # Table...: regra_extrat_bcio
     # Factory.: cmg910wlFactory
     # Register: cmg.cmg910wl.Factory
     ####################################################################################################*/
    function cmg910wlFactory($totvsresource, dboFactory) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cmg/cmg910wl/:method//:user//:id');

        angular.extend(factory, dboFactory);

        return factory;

    }

    cmg910wlFactory.$inject = ['$totvsresource', 'dts-utils.dbo.Factory'];
    index.register.factory('cmg.cmg910wl.Factory', cmg910wlFactory);

});
