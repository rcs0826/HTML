/*globals index, define */
define([
	'index',
	'/dts/crm/html/script/script-services.list.js',
	'/dts/crm/html/script/script-services.edit.js',
	'/dts/crm/html/script/script-services.edit-status.js',
	'/dts/crm/html/script/script-services.detail.js',
	'/dts/crm/html/script/anwser/anwser-services.execution.js',
	'/dts/crm/html/script/script-services.advanced-search.js',
	'/dts/crm/html/script/analyzer/analyzer-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider.state('dts/crm/script', {
		'abstract': true,
		template: '<ui-view/>'
	}).state('dts/crm/script.start', {
		url: '/dts/crm/script/',
		controller: 'crm.script.list.control',
		controllerAs: 'scriptController',
		templateUrl: '/dts/crm/html/script/script.list.html'
	}).state('dts/crm/script.detail', {
		url: '/dts/crm/script/detail/:id',
		controller: 'crm.script.detail.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/script/script.detail.html'
	}).state('dts/crm/script.anwser', {
		url: '/dts/crm/script/anwser/:script_id/:resposta_id?entity&id',
		controller: 'crm.script-anwser.execution.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/script/anwser/anwser.detail.html'
	}).state('dts/crm/script.analyzer', {
		url: '/dts/crm/script/analyzer/:id?start&end',
		controller: 'crm.script-analyzer.detail.control',
		controllerAs: 'controller',
		templateUrl: '/dts/crm/html/script/analyzer/analyzer.detail.html'
	});
});
