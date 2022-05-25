/*globals require, requirejs, define */

// *************************************************************************************
// *** CALENDAR PROXY
// *************************************************************************************

require.config({
	paths: {
		'moment'	   : '/dts/crm/js/libs/3rdparty/moment/moment.min',
		'fullcalendar' : '/dts/crm/js/libs/3rdparty/fullcalendar/fullcalendar.min'
	},
	shim: {
		'fullcalendar' : ['moment']
	}
});

define([
	'fullcalendar',
	'css!/dts/crm/js/libs/3rdparty/fullcalendar/fullcalendar.min.css'
], function () {

	'use strict';

	requirejs(['ng-load!/dts/crm/js/libs/3rdparty/ui-calendar/ui-calendar.js']);
});
