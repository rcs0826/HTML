/*globals require, requirejs, define */

// *************************************************************************************
// *** CALENDAR PROXY
// *************************************************************************************

require.config({
	paths: {
		'jquery-minicolors' : '/dts/crm/js/libs/3rdparty/jquery-minicolors/jquery.minicolors.min'
	}
});

define([
	'jquery-minicolors',
	'css!/dts/crm/js/libs/3rdparty/jquery-minicolors/jquery.minicolors.css'
], function () {

	'use strict';

	requirejs(['ng-load!/dts/crm/js/libs/3rdparty/angular-minicolors/angular-minicolors.js']);
});
