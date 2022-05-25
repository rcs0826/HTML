/*jslint node: true */

'use strict';

// ***************************************
// *** HUB - Utils
// ***************************************

var HUBEvent, HUBRestService, HUBURL, HUBUtil;

// Eventos
HUBEvent = {};

// Servicos
HUBRestService = '/dts/datasul-rest/resources/api/fch/fchhub/fchhub';

HUBURL = {
    hierarchyTeamService: HUBRestService + '0002/'
};

HUBUtil = {

    /**
	 * @name HUBUtil.isDefined
	 * @kind function
	 *
	 * @description
	 * Determines if a reference is defined.
	 *
	 * @param {*} value reference to check.
	 * @returns {boolean} true if 'value' is defined and not null.
	 */
    isDefined: function(value) {
        return (typeof value !== 'undefined') && (value !== null) && (value !== 'null');
    },

    /**
	 * @name HUBUtil.isUndefined
	 * @kind function
	 *
	 * @description
	 * Determines if a reference is undefined.
	 *
	 * @param {*} value reference to check.
	 * @returns {boolean} true if 'value' is undefined or null.
	 */
    isUndefined: function(value) {
        return (typeof value === 'undefined') || (value === null) || (value === 'null');
    }
};
