define([
	'index'
], function(index) {
	'use strict';

	// ########################################################
	// ### Factories
	// ########################################################
    alternativeBuyerFactory.$inject = ['$totvsresource'];
    function alternativeBuyerFactory($totvsresource) {
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi360/:path/:buyer', {}, {});

        return factory;
    }

	// ########################################################
	// ### Registers
	// ########################################################
    index.register.factory('mcc.ccapi360.Factory', alternativeBuyerFactory);
});
